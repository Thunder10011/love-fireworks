import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import Firework from './components/Firework';

// 在这里修改名字
const NAME = "小宝";

const romanticMessages = [
  `✨ ${NAME}，你是我生命中最美丽的烟火 ✨`,
  `💫 愿与${NAME}共赏漫天星辰 💫`,
  `💝 有${NAME}的每一天都是最浪漫的日子 💝`,
  `🌟 ${NAME}，你是我最美的意外 🌟`,
  `💖 愿陪${NAME}走过漫长岁月 💖`,
  `💕 ${NAME}，你的笑容比烟花更美 💕`,
  `✨ ${NAME}，愿你的生活绚烂如烟 ✨`,
  `💫 ${NAME}，你是我永远的星辰 💫`,
];

export default function App() {
  const [message, setMessage] = useState('');
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    // 设置初始消息
    setMessage(`💝 ${NAME}，献给你的浪漫烟火 💝`);

    // 随机显示消息
    const interval = setInterval(() => {
      const randomMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
      setMessage(randomMessage);
    }, 3000);

    // 每隔一段时间添加新的烟花
    const fireworkInterval = setInterval(() => {
      // 清理旧的烟花
      setFireworks(prev => {
        const now = Date.now();
        return [...prev.filter(fw => now - fw.id < 2000), {
          id: now,
          x: Math.random() * 90 + 5, // 避免太靠近边缘
          y: Math.random() * 70 + 5, // 避免太靠近底部
        }];
      });
    }, 800); // 缩短间隔，让烟花更密集

    return () => {
      clearInterval(interval);
      clearInterval(fireworkInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      {fireworks.map(firework => (
        <Firework key={firework.id} x={firework.x} y={firework.y} />
      ))}
      <Animated.Text style={styles.message}>{message}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    bottom: 100,
    padding: 20,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
}); 