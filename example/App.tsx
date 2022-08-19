import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Canvas, Rect} from '@shopify/react-native-skia';
import {makeSkSkottieFromString} from 'react-native-skia-module';

const App = () => {
  const skAnim = makeSkSkottieFromString(
    JSON.stringify(require('./assets/material_wave_loading.json')),
  );
  console.log(skAnim);

  return (
    <SafeAreaView style={styles.flex1}>
      <Canvas style={styles.flex1}>
        <Rect x={10} y={10} width={100} height={100} color="red" />
      </Canvas>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
