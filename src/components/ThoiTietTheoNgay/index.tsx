import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatNhietDo } from '../../utils';

type Props = {
  gio: string;
  moTa: string;
  nhietDo: number;
};

export default function ThoiTietTheoNgay({ gio, moTa, nhietDo }: Props) {
  return (
    <View style={styles.row}>
      <Text>{gio}</Text>
      <Text>
        {moTa} {formatNhietDo(nhietDo)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
