#!/bin/bash

# GitHub'a yüklemek için komutlar
# (GitHub'da oluşturduğunuz repository URL'ini kullanın)

# 1. Git init (eğer daha önce yapmadıysanız)
git init

# 2. Tüm dosyaları ekle
git add .

# 3. İlk commit
git commit -m "Initial commit - Ordu Sınav Merkezi"

# 4. GitHub repository'nizi ekleyin (KULLANICI_ADINIZ ve REPO_ADI'nı değiştirin)
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADI.git

# 5. Main branch oluştur
git branch -M main

# 6. GitHub'a push et
git push -u origin main
