Source: https://www.exandroid.dev/2021/03/21/capture-all-android-network-traffic/

#### Workflow

```bash
sudo mv apktool /usr/local/bin
sudo mv apktool.jar /usr/local/bin
apktool d toffee.apk # decompiles to ./toffee
apktool b toffee -o toffee-patch.apk --use-aapt2  # recompile
keytool -genkey -v -keystore toffee.keystore -alias sign -keyalg RSA -keysize 2048 -validity 10000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore toffee.keystore toffee-patch.apk sign # sign
zipalign -p -f 4 toffee-patch.apk  toffee-patch2.apk
adb install toffee-patch2.apk
```

##### issues
Recompile flag: https://github.com/iBotPeaches/Apktool/issues/2566 \
Compression issue: https://github.com/iBotPeaches/Apktool/issues/1626
