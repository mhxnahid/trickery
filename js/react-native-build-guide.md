### Expo

1. Export to `dist` folder (rm -rf the dist folder if already exists one)
```
expo export --dev --public-url http://127.0.0.1:8010
```

2. Run an http server
```
npx http-server -p 8010 ./dist
```

3. Build APK
```
EXPO_ANDROID_KEYSTORE_PASSWORD="passpass" EXPO_ANDROID_KEY_PASSWORD="passpass" turtle build:android   --type apk   --keystore-path /path/to/key.jks   --keystore-alias "key0"   --allow-non-https-public-url   --public-url http://127.0.0.1:8010/android-index.json
```

Generate a `.jks` file using Android Studio.

### CLI

1. Generate keystore file
```
badcDrawerNative/android$ keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Add PATH to `./android/gradle.properties`
```
...
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=elsels
MYAPP_UPLOAD_KEY_PASSWORD=elsels
```

3. Add some settings in `.android/app/build.gradle`
```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```
4. Build
```
badcDrawerNative/android$ ./gradlew bundleRelease
```

Generates `./android/app/build/outputs/bundle/release/app.aab` (to publish in play store) and the debug apk is in `./android/app/build/outputs/apk/debug/ap-debug.apk`

