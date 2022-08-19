import { NativeModules, Platform } from 'react-native';
import type { SkCanvas, SkRect } from "@shopify/react-native-skia";

const LINKING_ERROR =
  `The package 'react-native-skia-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SkiaModule = NativeModules.SkiaModule
  ? NativeModules.SkiaModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

if (typeof SkiaModule.install === "function") {
  SkiaModule.install();
} else {
  throw new Error("Couldn't call SkiaModule.install! Fuck.");
}

type SkSkottie = {
  render: (canvas: SkCanvas, rect: SkRect) => void;
  seek: (progress: number) => void;
}
declare global {
  var SkiaApi_SkottieCtor: (jsonString: string) => SkSkottie;
}

export const makeSkSkottieFromString = global.SkiaApi_SkottieCtor;