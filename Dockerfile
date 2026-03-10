# Resmi Bun imajını kullan
FROM oven/bun:1 as base

# Çalışma dizinini ayarla
WORKDIR /app

# 1. Adım: Bağımlılıkları yükle
# Önbellekleme (caching) için önce sadece paket dosyalarını kopyalıyoruz
COPY package.json bun.lock ./

# Bağımlılıkları yükle
RUN bun install --frozen-lockfile

# 2. Adım: Kaynak kodları kopyala
COPY . .

# 3. Adım: Prisma Client'ı oluştur
# Docker Linux tabanlı olduğu için Prisma client'ı burada tekrar üretilmelidir.
RUN bun x prisma generate

# Uygulamanın çalışacağı port (Uygulaman 3000 kullanıyorsa burayı değiştirme)
EXPOSE 3000

# 4. Adım: Uygulamayı başlat
# Eğer package.json içinde "start" scriptin varsa:
RUN chown -R 1000:1000 /app
USER 1000
CMD ["bun", "run", "start"]

# EĞER start scriptin yoksa ve direkt dosyayı çalıştırıyorsan (örneğin index.ts):
# CMD ["bun", "run", "src/index.ts"]