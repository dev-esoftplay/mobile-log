import { esp, LibNotification } from 'esoftplay';
import * as ErrorReport from 'esoftplay/error';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens, enableFreeze } from 'react-native-screens';
const { globalIdx } = require('esoftplay/global');
enableScreens();
enableFreeze();

Notifications.addNotificationResponseReceivedListener(x => LibNotification.onAction(x));

export default function App() {
	const Home = useRef(esp.home()).current

	useEffect(() => {
		globalIdx.reset()
		ErrorReport.getError()
	}, [])

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Home />
		</GestureHandlerRootView>
	)
}