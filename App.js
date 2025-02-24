import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import Firework from './components/Firework';

// 在这里修改名字
const NAME = "小宝";
const MAX_NO_CLICKS = 5;

const romanticMessages = [
  `💋 ${NAME}，想亲亲你的小嘴 💋`,
  `💗 想和${NAME}一起做羞羞的事 💗`,
  `💝 ${NAME}的身体好诱人呀 💝`,
  `🌹 想和${NAME}一起感受爱的温度 🌹`,
  `💘 ${NAME}，你是我的小奶猫 💘`,
  `💕 想和${NAME}一起沉沦在爱爱里 💕`,
  `✨ ${NAME}，你的每个样子都让我着迷 ✨`,
  `💫 ${NAME}，想和你一起体验爱爱的滋味 💫`,
];

export default function App() {
  const [showFireworks, setShowFireworks] = useState(false);
  const [message, setMessage] = useState('');
  const [fireworks, setFireworks] = useState([]);
  const [noClickCount, setNoClickCount] = useState(0);
  
  // 按钮动画值
  const yesButtonScale = useRef(new Animated.Value(1)).current;
  const noButtonScale = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showFireworks) {
      // 设置初始消息
      setMessage(`💝 ${NAME}，献给你的浪漫烟火 💝`);

      // 随机显示消息
      const interval = setInterval(() => {
        const randomMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
        setMessage(randomMessage);
      }, 3000);

      // 烟花效果
      const fireworkInterval = setInterval(() => {
        setFireworks(prev => {
          const now = Date.now();
          return [...prev.filter(fw => now - fw.id < 2000), {
            id: now,
            x: Math.random() * 90 + 5,
            y: Math.random() * 70 + 5,
          }];
        });
      }, 800);

      return () => {
        clearInterval(interval);
        clearInterval(fireworkInterval);
      };
    }
  }, [showFireworks]);

  const handleYesClick = () => {
    // 淡出动画
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowFireworks(true);
    });
  };

  const handleNoClick = () => {
    setNoClickCount(prev => {
      const newCount = prev + 1;
      
      // 按钮动画
      Animated.parallel([
        // 不愿意按钮缩小并保持
        Animated.timing(noButtonScale, {
          toValue: Math.pow(0.8, newCount), // 改为 0.8，缩小幅度更温和
          duration: 200,
          useNativeDriver: true,
        }),
        // 愿意按钮放大并保持
        Animated.timing(yesButtonScale, {
          toValue: Math.pow(1.2, newCount), // 改为 1.2，放大幅度更温和
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      return newCount;
    });
  };

  return (
    <View style={styles.container}>
      {showFireworks && fireworks.map(firework => (
        <Firework key={firework.id} x={firework.x} y={firework.y} />
      ))}
      
      <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
        {/* 道歉文字和表情 */}
        <View style={styles.textContainer}>
          <Text style={styles.apologyText}>
            我实在忍不住想涩涩你的冲动{'\n'}
            可以sese吗？
          </Text>
          <Text style={styles.emoji}>
            🥺👉👈
          </Text>
        </View>

        {/* 按钮容器 */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: yesButtonScale }] }}>
            <TouchableOpacity 
              style={[styles.button, styles.yesButton]} 
              onPress={handleYesClick}
            >
              <Text style={styles.buttonText}>愿意</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {noClickCount < MAX_NO_CLICKS && (
            <Animated.View style={{ transform: [{ scale: noButtonScale }] }}>
              <TouchableOpacity 
                style={[styles.button, styles.noButton]} 
                onPress={handleNoClick}
              >
                <Text style={styles.buttonText}>不愿意</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {showFireworks && (
        <Animated.Text style={styles.message}>{message}</Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  apologyText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  emoji: {
    fontSize: 40,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  yesButton: {
    backgroundColor: '#ff69b4',
  },
  noButton: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  message: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -150 }, { translateY: -20 }],
    padding: 20,
    width: 300,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
}); 