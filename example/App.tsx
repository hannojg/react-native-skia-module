import React, {useEffect, useRef} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Skia,
  Rect,
  SkiaView,
  useDrawCallback,
  useTiming,
  Easing,
} from '@shopify/react-native-skia';
import {makeSkSkottieFromString, SkSkottie} from 'react-native-skia-module';

const App = () => {
  const skAnim: SkSkottie = makeSkSkottieFromString(
    JSON.stringify(require('./assets/material_wave_loading.json')),
  );

  // NOTE: This example runs the drawCallback on the JS Thread!
  const progress = useTiming(
    {
      from: 0,
      to: 1,
      loop: true,
    },
    {
      duration: skAnim.duration * 1000,
      easing: Easing.linear,
    },
  );

  const onDraw = useDrawCallback((canvas, info) => {
    skAnim.seek(progress.current);
    skAnim.render(canvas, Skia.XYWHRect(0, 0, info.width, info.height));
  });

  const skRef = useRef<SkiaView>(null);
  useEffect(() => {
    skRef.current?.registerValues([progress]);
  }, [progress]);

  return (
    <SafeAreaView style={styles.flex1}>
      <SkiaView ref={skRef} style={styles.flex1} onDraw={onDraw} />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
