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

$runs = @(
    @{ Key = "register"; Folder = "API1 Register" },
    @{ Key = "coupon"; Folder = "API2 Coupon" },
    @{ Key = "product"; Folder = "API3 Product" }
)

function Stop-ExactBackend {
    $listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    foreach ($listener in $listeners) {
        $process = Get-Process -Id $listener.OwningProcess -ErrorAction Stop
        if ($process.ProcessName -ne "node") {
            throw "Refusing to stop non-Node process $($process.Id) on port 3000"
        }
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
$outcomes = @()

foreach ($run in $runs) {
    $process = Start-CleanBackend $run.Key
    $jsonReport = Join-Path $reportDir "$($run.Key)-run.json"
    $cliReport = Join-Path $reportDir "$($run.Key)-run.cli.txt"
    try {
        & $nodeExe $newmanJs run $collection -e $environment `
            --folder "00 Setup" --folder $run.Folder --folder "99 Verification-Teardown" `
            --timeout-request 5000 --timeout 180000 `
            --reporters "cli,json" --reporter-json-export $jsonReport --color off *>&1 |
            Out-File -LiteralPath $cliReport -Encoding utf8
        $exitCode = $LASTEXITCODE
    } finally {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
    $outcomes += [PSCustomObject]@{ API = $run.Key; Folder = $run.Folder; ExitCode = $exitCode; Json = $jsonReport; Cli = $cliReport }
}

$outcomes | Format-Table -AutoSize

