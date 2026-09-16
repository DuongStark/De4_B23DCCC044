import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNhietDo } from '../../utils';

type Props = {
  gio: string;
  moTa: string;
  nhietDo: number;
};

export default function ThoiTietTheoGio({ gio, moTa, nhietDo }: Props) {
  return (
    <View style={styles.card}>
      <Text>{gio}</Text>
      <Text style={styles.moTa}>{moTa}</Text>
      <Text>{formatNhietDo(nhietDo)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  moTa: { fontWeight: '600', marginVertical: 4 },
});
