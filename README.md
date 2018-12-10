# Parrot-Gateway


## qrcode

### node-canvas install

```bash
// ubuntu: 
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

// mac: 
brew install pkg-config cairo pango libpng jpeg giflib
```

```bash
npm install canvas
```

## ffmpeg

```bash
//mac
brew install ffmpeg

// ubuntu
sudo apt-get install ffmpeg
```

```bash
npm install fluent-ffmpeg
```

## restart mongodb

```bash
sudo mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongod.log --logappend  -fork -port 27017
```
