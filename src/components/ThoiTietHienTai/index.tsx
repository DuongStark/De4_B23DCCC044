import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNhietDo } from '../../utils';

type Props = {
  city: string;
  nhietDo: number;
};

export default function ThoiTietHienTai({ city, nhietDo }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.temp}>{formatNhietDo(nhietDo)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 24 },
  city: { fontSize: 18 },
  temp: { fontSize: 48, fontWeight: '600' },
});
