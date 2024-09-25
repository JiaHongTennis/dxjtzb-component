import { LoadingToast } from './component/LoadingToast'
import './App.css';

function App() {
  function showLoading() {

    LoadingToast().then(({ toSuccess, toError, close }) => {
      setTimeout(() => {
        toError()
      }, 2000)
      setTimeout(() => {
        toSuccess()
      }, 4000)
      setTimeout(() => {
        close()
      }, 6000)
    })

  }
  return (
    <div className="App">
      <button onClick={showLoading}>显示</button>
    </div>
  );
}

export default App;
