### Prompt 1:

1. Cấu trúc lại — thêm EC Summary, Test Matrix, gộp state ECs
2. Gộp 4 TC positive trùng → 1 base TC
3. Sửa DT-A-016 — bỏ TC mâu thuẫn (Negative nhưng expect 200)
4. 100% EC coverage — từ 19/21 lên 16/16
5. Tách Supplementary Tests ra section riêng
6. Expected result chi tiết hơn — ghi rõ counter behavior khi locked
7. Renumber liên tục DT-A-001→018

### Prompt 2: 
 @hw/hw2/submission/report/feature_A/04_bva_table.md   ▎ 1. Field locked_until — sửa Now-1 row:                                                        
  ▎ - Now-1 = now() - 1 second → Lock Status phải là Expired (unlocked) → Expected: 200 (không phải 403)                                                
  ▎ - Description sửa thành: "Vừa hết hạn 1 giây trước"                                                                                                 
  ▎ - Đảm bảo logic: now - 1s = past = unlocked, now + 1s = future = locked                                                                             
                                                                                                                                                        
  ▎ 2. Field login_attempts — sửa Min+1 row:                                                                                                            
  ▎ - Min+1 = 1: xóa description "After 1st wrong password" — giá trị 1 không xuất hiện trong normal flow (code nhảy 0→2→4)                             
  ▎ - Sửa Behavior: "Nếu stored = 1, next fail → newAttempts = 3 >= 3 → LOCK" (không phải "still unlocked")                                             
  ▎ - Thêm note: giá trị 1 chỉ đạt được qua DB manipulation                                                                                             
                                                                                                                                                        
  ▎ 3. Field login_attempts — clarify stored vs check value:                                                                                            
  ▎ - Thêm 1 dòng note dưới bảng: "Lưu ý: lock trigger check trên newAttempts = stored + 2. Boundary thực tế: stored >= 1 → next fail triggers lock."   
                                                                                                                                                        
  ▎ 4. Fields email và password — thêm disclaimer:                                                                                                      
  ▎ - Thêm note sau mỗi bảng: "Backend không enforce length limit. Boundaries trên là theoretical (RFC/practical), không phải behavioral boundary của   
hệ                                                                                                                                                      
   thống. Mục đích: test system resilience."                                                                                                            
                                                                                                                                                        
  ▎ 5. Summary table — sửa count:                                                                                                                       
  ▎ - Email: 3 → 4 (0, 3, 320, 321)                                                                                                                     
  ▎ - login_attempts: 4 → 5 (0, 2, 3, 4, INT_MAX)  


### Prompt 3: 
 ▎ Sửa file 05_bva_testcases.md theo các điểm sau:

  ▎ 1. BVA-A-022 — sửa expected result:
  ▎ - locked_until = now() - 1s → lock đã hết hạn → Expected: 200 (unlocked)
  ▎ - Đổi label "Just before expiry" → "Just after expiry (vừa hết hạn)"
  ▎ - Xóa "(technically still locked, now < locked_until)" → thay bằng "(lock expired, now > locked_until)"

  ▎ 2. BVA-A-016 — tách khỏi locked:
  ▎ - Đổi thành: Counter: 4, Locked: NULL, Password: WrongPass! → Expected: 401, counter → 6, re-lock triggered
  ▎ - Mục đích: test counter boundary, không bị lock che mất

  ▎ 3. BVA-A-013 — thêm wrong password scenario:
  ▎ - Giữ BVA-A-013: counter=1, correct pw → 200
  ▎ - Thêm BVA-A-013b: counter=1, wrong pw → 401, counter 1→3 (exact threshold), LOCK triggered

  ▎ 4. BVA-A-014 — tách 2 scenario:
  ▎ - BVA-A-014a: counter=2, correct pw → 200, counter reset
  ▎ - BVA-A-014b: counter=2, wrong pw → 401, counter 2→4, LOCK

  ▎ 5. Gộp TC nominal trùng:
  ▎ - Gộp BVA-A-003, 009, 012, 019 thành 1 TC base (e.g., BVA-A-003). Ghi note: "Covers nominal/min boundaries for email length, password length,
  counter, locked_until"
  ▎ - Xóa 3 TC trùng còn lại

  ▎ 6. Special Cases → đổi tên hoặc xóa:
  ▎ - Đổi section "Special Cases" thành "Supplementary Tests (non-BVA)" + ghi note: "Các TC dưới đây test categorical values, không phải boundary
  values. Đặt ở đây để tiện tham khảo."

  ▎ 7. Renumber và update Coverage Summary cho khớp sau khi sửa.

### Prompt 4:
 ▎ Viết lại file 06_detailed_testcases.md từ source v1, không tự sáng tạo TC.                                                                       
                                                                                                                                                      
  ▎ 1. Domain TCs — sync lại với 03_domain_testcases_v1.md:                                                                                           
  ▎ - Giữ đúng 18 TC (DT-A-001→018) theo 03_v1, không thêm không bớt                                                                                  
  ▎ - Xóa các TC trùng happy path (DT-A-009, 014, 016, 017 trong 06 cũ)                                                                               
  ▎ - Đảm bảo có DT-A-006 = email quá dài (EC-E6) — hiện đang thiếu                                                                                   
  ▎ - Sửa 03_v1 DT-A-013 và DT-A-018: status code 401 → 403 cho locked account (khớp với code)                                                        
                                                                                                                                                      
  ▎ 2. BVA TCs — sync lại với 05_bva_testcases_v1.md:                                                                                                 
  ▎ - Giữ đúng 27 TC (BVA-A-001→027) theo 05_v1                                                                                                       
  ▎ - Thêm lại BVA-A-012 (counter=1, wrong pw → exact threshold LOCK) — đang thiếu                                                                    
  ▎ - Thêm lại BVA-A-013 (counter=2, correct pw → 200, reset) — đang thiếu                                                                            
  ▎ - Sửa BVA-A-016: đổi thành counter=4, locked=NULL, wrong pw → re-lock (theo 05_v1)                                                                
  ▎ - Xóa BVA-A-009 nominal (đã gộp vào BVA-A-003) và BVA-A-019 NULL (đã gộp vào BVA-A-003)                                                           
                                                                                                                                                      
  ▎ 3. Thống kê — cập nhật cho khớp:                                                                                                                  
  ▎ - Domain: 18 TC                                                                                                                                   
  ▎ - BVA: 27 TC                                                                                                                                      
  ▎ - Total: 45 TC                                                                                                                                    
                                                                                                                                                      
  ▎ 4. Nguyên tắc chung:                                                                                                                              
  ▎ - Mỗi TC trong 06 phải trace được về đúng 1 TC trong 03_v1 hoặc 05_v1                                                                             
  ▎ - Không tự thêm TC mới — nếu cần thêm thì sửa source file trước 
  