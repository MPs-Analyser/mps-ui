import "./styles/toast.css";

const Toast = ({ message  }) => {

  return (
    <div className={`toast ${message.type}`}>
        <p>{message.text}</p>
    </div>
   
  )
}

export default Toast;
