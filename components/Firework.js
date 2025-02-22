import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const PARTICLE_COUNT = 36; // 增加更多粒子
const PARTICLE_SPREAD = 200; // 增加扩散范围

const getRandomColor = () => {
  // 更真实的烟花颜色
  const colors = [
    '#ff4444', '#ff8844', '#ffff44', 
    '#44ff44', '#44ffff', '#ff44ff',
    '#ff6666', '#ffaa66', '#66ffff'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Particle = ({ x, y, color }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const angle = Math.random() * Math.PI * 2;
    const distance = (Math.random() * 0.5 + 0.5) * PARTICLE_SPREAD; // 更自然的距离分布
    const duration = 1000 + Math.random() * 500; // 随机持续时间
    
    Animated.parallel([
      // 爆炸动画
      Animated.sequence([
        // 快速放大
        Animated.timing(scale, {
          toValue: Math.random() * 0.4 + 0.3, // 更小的粒子
          duration: 200,
          useNativeDriver: true,
        }),
        // 缓慢缩小
        Animated.timing(scale, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        })
      ]),
      // 扩散动画 - 使用 spring 让运动更自然
      Animated.spring(translateX, {
        toValue: Math.cos(angle) * distance,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: Math.sin(angle) * distance,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }),
      // 淡出动画
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          backgroundColor: color,
          opacity,
          transform: [
            { scale },
            { translateX },
            { translateY },
          ],
        },
      ]}
    >
      <View style={[styles.particleCore, { backgroundColor: '#ffffff' }]} />
      {/* 添加拖尾效果 */}
      <View style={[styles.particleTrail, { backgroundColor: color }]} />
    </Animated.View>
  );
};

const Firework = ({ x, y }) => {
  const particles = Array(PARTICLE_COUNT).fill(0);
  const color = getRandomColor();
  const mainScale = useRef(new Animated.Value(0)).current;
  const mainOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 初始爆炸点动画
      Animated.spring(mainScale, {
        toValue: 0.8,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(mainOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.firework, { left: `${x}%`, top: `${y}%` }]}>
      <Animated.View
        style={[
          styles.main,
          {
            backgroundColor: color,
            opacity: mainOpacity,
            transform: [{ scale: mainScale }],
          },
        ]}
      />
      {particles.map((_, index) => (
        <Particle
          key={index}
          x={0}
          y={0}
          color={color}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  firework: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 7.5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleCore: {
    width: 2,
    height: 2,
    borderRadius: 1,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  particleTrail: {
    position: 'absolute',
    width: 2,
    height: 6,
    borderRadius: 1,
    opacity: 0.3,
    transform: [{ translateY: 4 }],
  },
});

export default Firework; 