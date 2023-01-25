import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { VoiceRecorder } from "capacitor-voice-recorder";
import "./Tab1.css";
import { useState } from "react";

const Tab1: React.FC = () => {
  let [status, setStatus] = useState("DISABLED");
  let [audio, setAudio] = useState();

  const speak = async () => {
    const result = await VoiceRecorder.hasAudioRecordingPermission();

    if (!result.value) {
      const { value } = await VoiceRecorder.requestAudioRecordingPermission();
      if (!value) return;
    }

    await VoiceRecorder.startRecording();
    setStatus("RECORDING");
  };

  const pause = async () => {
    if (status === "RECORDING") {
      await VoiceRecorder.pauseRecording();
      setStatus("PAUSED");
    } else {
      await VoiceRecorder.resumeRecording();
      setStatus("RECORDING");
    }
  };

  const stop = async () => {
    const result = await VoiceRecorder.stopRecording();
    const { recordDataBase64, mimeType } = result.value;
    const audioRef = new Audio(`data:${mimeType};base64,${recordDataBase64}`);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
    setStatus("DISABLED");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chat GPT</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Chat GPT</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>Microphone: {status}</p>
        <IonButton onClick={speak}>Start</IonButton>
        <IonButton onClick={pause}>
          {status === "RECORDING" ? "Pause" : "Resume"}
        </IonButton>
        <IonButton onClick={stop}>Stop</IonButton>
        {/* <p>{Record}</p> */}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
