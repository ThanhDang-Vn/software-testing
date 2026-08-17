param(
    [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.."))
)

$ErrorActionPreference = "Stop"
$nodeExe = "C:\Users\dn156\AppData\Local\Volta\tools\image\node\20.20.2\node.exe"
$newmanJs = Join-Path $RepositoryRoot "hw\hw6\.tools\newman\node_modules\newman\bin\newman.js"
$backend = Join-Path $RepositoryRoot "hw\eshop-sut\backend"
$collection = Join-Path $RepositoryRoot "hw\hw6\postman\23127334_HW06_API_Testing.postman_collection.json"
$environment = Join-Path $RepositoryRoot "hw\hw6\postman\23127334_HW06_Local.postman_environment.json"
$reportDir = Join-Path $RepositoryRoot "hw\hw6\reports\newman"
$machineReportDir = Join-Path $RepositoryRoot "hw\hw6\.tools\newman-results"

$runs = @(
    @{ Key = "register"; Folder = "API1 Register"; Data = (Join-Path $RepositoryRoot "hw\hw6\postman\data\register-data.json") },
    @{ Key = "coupon"; Folder = "API2 Coupon"; Data = (Join-Path $RepositoryRoot "hw\hw6\postman\data\coupon-data.json") },
    @{ Key = "product"; Folder = "API3 Product"; Data = (Join-Path $RepositoryRoot "hw\hw6\postman\data\product-data.json") }
)

function Stop-ExactBackend {
    $listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    foreach ($listener in $listeners) {
        $process = Get-Process -Id $listener.OwningProcess -ErrorAction Stop
        if ($process.ProcessName -ne "node") { throw "Refusing to stop non-Node process $($process.Id) on port 3000" }
        Stop-Process -Id $process.Id -Force
        $process.WaitForExit()
    }
}

function Start-CleanBackend([string]$key) {
    Stop-ExactBackend
    $stdout = Join-Path $reportDir "$key-backend.stdout.log"
    $stderr = Join-Path $reportDir "$key-backend.stderr.log"
    $process = Start-Process -FilePath $nodeExe -ArgumentList "server.js" -WorkingDirectory $backend `
        -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) { $ready = $true; break }
        } catch {}
        Start-Sleep -Milliseconds 500
    }
    if (-not $ready) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        throw "Backend failed to become ready for $key"
    }
    return $process
}

New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
New-Item -ItemType Directory -Path $machineReportDir -Force | Out-Null
$nodeVersion = (& $nodeExe --version).Trim()
$newmanVersion = (& $nodeExe $newmanJs --version).Trim()
$outcomes = @()

foreach ($run in $runs) {
    $process = Start-CleanBackend $run.Key
    $jsonReport = Join-Path $machineReportDir "$($run.Key)-run.json"
    $htmlReport = Join-Path $reportDir "$($run.Key)-run.html"
    $cliReport = Join-Path $reportDir "$($run.Key)-run.cli.txt"
    $started = [DateTime]::UtcNow.ToString("o")
    $displayCommand = "node hw/hw6/.tools/newman/node_modules/newman/bin/newman.js run hw/hw6/postman/23127334_HW06_API_Testing.postman_collection.json -e hw/hw6/postman/23127334_HW06_Local.postman_environment.json -d hw/hw6/postman/data/$($run.Key)-data.json --folder `"00 Setup`" --folder `"$($run.Folder)`" --folder `"99 Verification-Teardown`" --timeout-request 5000 --timeout 300000 --reporters cli,json,htmlextra --reporter-json-export hw/hw6/.tools/newman-results/$($run.Key)-run.json --reporter-htmlextra-export hw/hw6/reports/newman/$($run.Key)-run.html --reporter-htmlextra-skipSensitiveData --color off"
    @(
        "RUN_KEY=$($run.Key)",
        "TIMESTAMP_START_UTC=$started",
        "NODE_VERSION=$nodeVersion",
        "NEWMAN_VERSION=$newmanVersion",
        "COMMAND=$displayCommand",
        "DATA_FILE=$($run.Data)",
        "BACKEND_RESET_SEEDED=True",
        "--- NEWMAN OUTPUT ---"
    ) | Out-File -LiteralPath $cliReport -Encoding utf8
    try {
        & $nodeExe $newmanJs run $collection -e $environment -d $run.Data `
            --folder "00 Setup" --folder $run.Folder --folder "99 Verification-Teardown" `
            --timeout-request 5000 --timeout 300000 `
            --reporters "cli,json,htmlextra" --reporter-json-export $jsonReport `
            --reporter-htmlextra-export $htmlReport --reporter-htmlextra-skipSensitiveData `
            --color off *>&1 | Out-File -LiteralPath $cliReport -Encoding utf8 -Append
        $exitCode = $LASTEXITCODE
    } finally {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
    @(
        "--- END NEWMAN OUTPUT ---",
        "TIMESTAMP_END_UTC=$([DateTime]::UtcNow.ToString('o'))",
        "NEWMAN_EXIT_CODE=$exitCode"
    ) | Out-File -LiteralPath $cliReport -Encoding utf8 -Append
    $outcomes += [PSCustomObject]@{ API = $run.Key; Folder = $run.Folder; ExitCode = $exitCode; Data = $run.Data; Json = $jsonReport; Html = $htmlReport; Cli = $cliReport }
}

$outcomes | Format-Table -AutoSize
