# Test Scripts — feature_A (FR-02)

> Các script dùng để thực thi TC qua API (`curl`). Chỉ ghi các pattern đặc biệt, không lặp.

---

## Setup

```bash
BACKEND="http://localhost:3000"
DB_PATH="path/to/backend/database.sqlite"
```

## Helpers

```bash
# Reset user về trạng thái sạch
reset_db() {
  sqlite3 "$DB_PATH" "UPDATE users SET login_attempts=0, locked_until=NULL WHERE email='test@eshop.com';"
}

# Set counter + lock tùy ý
set_state() { # $1=counter, $2=locked_until (ISO hoặc NULL)
  sqlite3 "$DB_PATH" "UPDATE users SET login_attempts=$1, locked_until=$2 WHERE email='test@eshop.com';"
}

# Đọc state hiện tại
get_user() {
  sqlite3 "$DB_PATH" "SELECT login_attempts, locked_until FROM users WHERE email='test@eshop.com';"
}

# Login API call
login() { # $1=email, $2=password
  curl -s -w "\n%{http_code}" -X POST "$BACKEND/api/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$1\",\"password\":\"$2\"}"
}
```

## Đặc biệt: Email/Password chứa ký tự đặc biệt

Dùng raw JSON thay vì biến bash (tránh shell escape):

```bash
# Email có whitespace (DT-A-007)
curl -s -w "\n%{http_code}" -X POST "$BACKEND/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":" test@eshop.com ","password":"Test1234!"}'

# Password có trailing space (DT-A-011)
curl -s -w "\n%{http_code}" -X POST "$BACKEND/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234! "}'

# Unicode email (BVA-A-025)
curl -s -w "\n%{http_code}" -X POST "$BACKEND/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@tëst.com","password":"Test1234!"}'
```

## Đặc biệt: Sinh email/password dài (BVA length tests)

```bash
# Email 319/320/321 chars (BVA-A-004/005/006)
LOCAL_PART=$(printf 'a%.0s' {1..310})  # thay 310 bằng 311/312
EMAIL="${LOCAL_PART}@test.com"
echo "Length: ${#EMAIL}"
login "$EMAIL" "Test1234!"

# Password 1000/1001 chars (BVA-A-009/010)
LONG_PW=$(printf 'a%.0s' {1..1000})  # thay 1000 bằng 1001
login "test@eshop.com" "$LONG_PW"
```

## Đặc biệt: Set locked_until (PHẢI dùng ISO + Z suffix)

```bash
# ⚠️ SAI — SQLite datetime() không có Z → Node.js parse sai timezone → lock bypass
sqlite3 "$DB_PATH" "UPDATE users SET locked_until=datetime('now','+1 hour') WHERE email='test@eshop.com';"

# ✅ ĐÚNG — Dùng Node.js sinh ISO (giống code thật)
FUTURE=$(node -e "console.log(new Date(Date.now() + 3600000).toISOString())")
PAST_1S=$(node -e "console.log(new Date(Date.now() - 1000).toISOString())")
NOW_ISO=$(node -e "console.log(new Date().toISOString())")
FUTURE_1S=$(node -e "console.log(new Date(Date.now() + 1000).toISOString())")

# Set locked state
set_state 4 "'$FUTURE'"

# Set expired state
set_state 4 "'2020-01-01T00:00:00.000Z'"

# Set boundary times (BVA-A-021/022/023)
set_state 4 "'$PAST_1S'"    # now()-1s → expired
set_state 4 "'$NOW_ISO'"    # now()    → edge case
set_state 4 "'$FUTURE_1S'"  # now()+1s → locked
```

## Đặc biệt: Counter states cần DB manipulation

```bash
# Giá trị unreachable trong normal flow (BVA-A-011/012/015/018)
set_state 1 "NULL"   # counter=1: code nhảy 0→2→4, không bao giờ = 1
set_state 3 "NULL"   # counter=3: exact threshold, code không đạt
set_state -1 "NULL"  # counter=-1: corruption test

# Re-lock test — counter cao nhưng KHÔNG lock (BVA-A-016)
set_state 4 "NULL"   # counter=4, locked=NULL → test counter boundary thuần
```
