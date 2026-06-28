# Speech-to-Text using Windows built-in Speech Recognition
# Usage: stt.ps1 [timeout_seconds]
# Speak into your microphone when prompted

Add-Type -AssemblyName System.Speech

$timeout = if ($args[0]) { [int]$args[0] } else { 10 }

$recognizer = New-Object System.Speech.Recognition.SpeechRecognitionEngine
$recognizer.SetInputToDefaultAudioDevice()

$grammar = New-Object System.Speech.Recognition.DictationGrammar
$recognizer.LoadGrammar($grammar)

Write-Host "Listening for $timeout seconds... Speak now."

$recognizer.BabbleTimeout = [TimeSpan]::FromSeconds(2)
$recognizer.InitialSilenceTimeout = [TimeSpan]::FromSeconds(3)
$recognizer.EndSilenceTimeout = [TimeSpan]::FromSeconds(1)

$source = $recognizer
$recognizedText = $null

$handler = {
    if ($args[0].Result -and $args[0].Result.Text) {
        $script:recognizedText = $args[0].Result.Text
        Write-Host "Heard: $($args[0].Result.Text)"
    }
}

$recognizer.add_Recognized($handler)
$recognizer.RecognizeAsync([System.Speech.Recognition.RecognizeMode]::Multiple)

Start-Sleep -Seconds $timeout

$recognizer.RecognizeAsyncStop()
$recognizer.Dispose()

if ($recognizedText) {
    Write-Host "FINAL: $recognizedText"
} else {
    Write-Host "No speech detected."
}
