import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, StyleSheet, Text, View, Platform } from 'react-native';
import { useToast } from '../context/ToastContext';
import { useAppTheme } from '../context/ThemeContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

export const Toast = () => {
  const { toast, hideToast } = useToast();
  const { colors } = useAppTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const closeToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => hideToast());
  }, [fadeAnim, hideToast, slideAnim]);

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 20,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        closeToast();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [toast, closeToast, fadeAnim, slideAnim]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={20} color="#10B981" />;
      case 'error':
        return <AlertCircle size={20} color="#EF4444" />;
      default:
        return <Info size={20} color="#3B82F6" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={[styles.message, { color: colors.textPrimary }]}>
        {toast.message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
});
