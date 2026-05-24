export default function Loader() {
  return (
    <>
      <style>
        {`
          .custom-loader {
  width: 48px;
  height: 48px;
  position: relative;
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(6px);
}

.custom-loader:before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 28px;
  height: 28px;
  transform: rotate(45deg) translate(30%, 40%);
  background: #E6D3B7;
  box-shadow: 24px -24px 0 4px #D4B896;
  animation: slide 1.2s infinite ease-in-out alternate;
}

.custom-loader:after {
  content: "";
  position: absolute;
  left: 8px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #D4B896;
  transform-origin: 26px 110px;
  animation: rotate 1.2s infinite ease-in-out;
}

@keyframes slide {
  0%, 100% { bottom: -24px; }
  25%, 75% { bottom: -1px; }
  20%, 80% { bottom: 2px; }
}

@keyframes rotate {
  0% { transform: rotate(-15deg); }
  25%, 75% { transform: rotate(0deg); }
  100% { transform: rotate(25deg); }
}
        `}
      </style>

      <div className="custom-loader" />
    </>
  );
}
