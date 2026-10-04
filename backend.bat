(
echo ===== ADMIN =====
for /r "src\modules\admin" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)

echo.
echo ===== OFFERS =====
for /r "src\modules\offers" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)

echo.
echo ===== ORDERS =====
for /r "src\modules\orders" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)

echo.
echo ===== PRODUCTS =====
for /r "src\modules\products" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)

echo.
echo ===== SETTINGS =====
for /r "src\modules\settings" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)

echo.
echo ===== TABLES =====
for /r "src\modules\tables" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)

echo.
echo ===== UPLOADS =====
for /r "src\modules\uploads" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)

echo.
echo ===== GATEWAY =====
for /r "src\gateway" %f in (*.ts) do (
    echo.
    echo ============================================================
    echo FILE: %f
    echo ============================================================
    type "%f"
)
) > backend-source.txt