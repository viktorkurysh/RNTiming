import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  block,
  Easing,
  startClock,
  useCode,
  Value,
  set,
  timing,
  eq,
  not,
  cond,
  and,
  clockRunning,
  stopClock,
} from 'react-native-reanimated';
import {useClock, useValue} from 'react-native-redash/lib/module/v1';
import ChatBubble from './ChatButtle';

function runTiming(clock) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  };
  const config = {
    toValue: new Value(1),
    duration: 1000,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config),
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(config.toValue, not(state.position)),
    ]),
    state.position,
  ]);
}

function App() {
  const [play, setPlay] = useState(false);
  const progress = useValue(0);
  const clock = useClock();
  const isPlaying = useValue(0);

  useCode(() => set(isPlaying, play ? 1 : 0), [play]);
  useCode(
    () => [
      cond(and(isPlaying, not(clockRunning(clock))), startClock(clock)),
      cond(and(not(isPlaying), clockRunning(clock)), stopClock(clock)),
      set(progress, runTiming(clock)),
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <ChatBubble {...{progress}} />
      </View>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setPlay((prev) => setPlay(!prev))}
        activeOpacity={1}>
        <Text style={styles.touchableText}>{play ? 'pause' : 'play'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    backgroundColor: '#6600CC',
  },
  touchableText: {
    fontSize: 20,
    color: '#FFF',
    margin: 10,
    textTransform: 'uppercase',
  },
});

export default App;
