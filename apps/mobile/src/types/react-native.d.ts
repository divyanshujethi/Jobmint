declare module "react-native" {
  import React from "react";

  export const View: React.FC<any>;
  export const Text: React.FC<any>;
  export const TouchableOpacity: React.FC<any>;
  export const TextInput: React.FC<any>;
  export const ScrollView: React.FC<any>;
  export const SafeAreaView: React.FC<any>;
  export const StatusBar: React.FC<any>;

  export namespace StyleSheet {
    export function create<T extends Record<string, any>>(styles: T): T;
  }

  export namespace Alert {
    export function alert(title: string, message?: string, buttons?: Array<{ text: string; onPress?: () => void }>): void;
  }
}