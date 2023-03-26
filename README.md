# Kiroku

Kiroku is a simple pomodoro timer that allows you to keep track of your work time.  
The timer is displayed on the status bar at the bottom of the vscode.  
There are four commands that the user can execute: start timer, stop timer, reset timer, and display settings.  
The working time is recorded in .vscode/kiroku.json.

## Configure settings

You need to set the working time and break time.  
The minimum work and break time is 1 minute and the maximum is 60 minutes.  
The work name can be omitted, but if no work name is set, no work will be recorded.  
The maximum length of a work name is 24 characters.

### How to setup

- Search and configure Kiroku from the Configuration
- Execute the Kiroku: Config command from the command palette

## Do the work

The timer changes color according to its status.  
| Running | Interval | Pause |
| ---- | ---- | ---- |
| light blue | orange | red |

### How to start working

- Click on the timer displayed on the status bar
- Execute the Kiroku: Run command from the command palette

The timer will appear light blue while it is working.

### How to stop work

- Click on the timer while you are working
- Execute the Kiroku: Pause command from the command palette

The timer is displayed in red while work is paused.

### Break time

When the work is completed, it automatically enters a interval state.  
The break is not executed automatically  
(would it be more convenient if it started automatically? (Would it be more convenient if it started automatically......?)  
During the break, the timer is displayed in orange.

### Reset the timer

The timer can be reset.  
Resetting will return the timer time to the beginning.  
Resetting the timer will not change the timer status from "working" to "resting" or "resting" to "working".

## In case of bugs

Bug reports are welcome.  
When you report a bug, please include how to reproduce it.  
This project is hobby development, so it is unclear when the fix will be available.

# Kiroku

Kiroku は作業時間を記録できるシンプルなポモドーロタイマーです。  
vscode 下部にあるステータスバーにタイマーが表示されます。  
使用者が実行できるコマンドはタイマー開始・タイマー停止・タイマーリセット・設定を表示するの４種類です。  
作業時間は.vscode/kiroku.json に記録されます。

## 設定を行う

作業時間・休憩時間を設定する必要があります。  
作業時間・休憩時間の最小値は１分で最大は６０分です。  
作業名を設定は行わないことも可能ですが、作業名を設定していない場合、作業は記録されません。  
作業名の最大文字数は 24 文字です。

### 設定方法

- 設定から Kiroku を検索し設定を行う
- コマンドパレットから Kiroku: Config コマンドを実行する

## 作業を行う

タイマーは状態によって色が変わります。  
| 作業中 | 休憩中 | 停止中 |
| ---- | ---- | ---- |
| 水色 | 橙色 | 赤色 |

### 作業を開始する方法

- ステータスバーに表示されているタイマーをクリックする
- コマンドパレットから Kiroku: Run コマンドを実行する

作業中はタイマーが水色に表示されます。

### 作業を停止する方法

- 作業中にタイマーをクリックする
- コマンドパレットから Kiroku: Pause コマンドを実行する

作業停止中はタイマーが赤色に表示されます。

### 休憩中

作業が完了すると自動で休憩状態に入ります。  
休憩は自動では実行されません。（自動で開始される方が便利かしら……？）  
休憩中はタイマーが橙色に表示されます。

### タイマーをリセットする

タイマーをリセットすることができます。  
リセットを行うとタイマー時間がはじめに戻ります。  
作業中 → 休憩中、休憩中 → 作業中に状態が移行することはありません。

## バグがあった場合

バグ報告を歓迎しています。  
バグ報告をするときは再現方法を記載してほしいです。  
このプロジェクトは趣味開発なので修正がいつになるかは不明です。
