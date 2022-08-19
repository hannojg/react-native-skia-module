import { configurations } from "../externals/react-native-skia/scripts/skia-configuration";
import { executeCmd } from "../externals/react-native-skia/scripts/utils";

const configuration = configurations.android;

console.log("Building skia with skottie for android...");
let command = "cd ./externals/react-native-skia";

Object.keys(configuration.targets).forEach((targetKey) => {
  command +=
    (command !== "" ? " && " : "") +
    `yarn ts-node ./scripts/build-skia.ts android ${targetKey} skia_enable_skottie=true`;
});

// after building we want to copy over the specific libraries for skottie
command += "&& cd ../.. && yarn rimraf ./module/android/libs";
Object.keys(configuration.targets).forEach((targetKey) => {
  ["libskottie.a", "libsksg.a", "libskshaper.a"].forEach((lib) => {
    command +=
    (command !== "" ? " && " : "") +
      `mkdir -p ./module/android/libs/${targetKey} && ` +
      `cp ./externals/react-native-skia/externals/skia/out/android/${targetKey}/${lib} ./module/android/libs/${targetKey}/${lib}`;
  });
});

executeCmd(command, "android-skottie", () => {
  console.log(`✅ Done building!`);
});
