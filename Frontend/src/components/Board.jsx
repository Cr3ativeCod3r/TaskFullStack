import React, { useRef, useState, useEffect } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const navigate = useNavigate();
  const [drawing, setDrawing] = useState(false);
  const [erasing, setErasing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [history, setHistory] = useState([]);
  const [isStraightLine, setIsStraightLine] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [addingText, setAddingText] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    const savedCanvas = localStorage.getItem("canvasState");
    if (savedCanvas) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedCanvas;
    }
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
    if (isStraightLine) {
      setStartPoint({ x: offsetX, y: offsetY });
    }
  };

  const finishDrawing = () => {
    ctxRef.current.closePath();
    setDrawing(false);
    saveToLocalStorage();
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.strokeStyle = erasing ? "#FFFFFF" : color;
    if (isStraightLine) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      restoreCanvas();
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(startPoint.x, startPoint.y);
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
      ctxRef.current.closePath();
    } else {
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
    }
  };

  const saveToLocalStorage = () => {
    const canvas = canvasRef.current;
    localStorage.setItem("canvasState", canvas.toDataURL());
  };

  const restoreCanvas = () => {
    const savedCanvas = localStorage.getItem("canvasState");
    if (savedCanvas) {
      const img = new Image();
      img.onload = () => {
        ctxRef.current.drawImage(img, 0, 0);
      };
      img.src = savedCanvas;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToLocalStorage();
  };

  const undo = () => {
    if (history.length > 0) {
      const previousState = history.pop();
      const img = new Image();
      img.onload = () => {
        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        ctxRef.current.drawImage(img, 0, 0);
      };
      img.src = previousState;
      setHistory([...history]);
    }
  };

  useEffect(() => {
    if (drawing) {
      const canvas = canvasRef.current;
      const currentState = canvas.toDataURL();
      setHistory([...history, currentState]);
    }
  }, [drawing]);

  const back = () => {
    navigate("/");
  };

  return (
    <>
      <div id="toolbar" className="text-black">
        <div className="flex">
          <button onClick={back} className="m-1">
            <CiLogout className="text-3xl" />
          </button>
          <button onClick={() => setErasing(false)} className="m-1">
            Pen
          </button>
          <button onClick={() => setErasing(true)} className="m-1">
            Rubber
          </button>
          <button onClick={clearCanvas} className="m-1">
            Clear
          </button>
          <button onClick={undo} className="m-1">
            Back
          </button>
        </div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="rounded-lg m-1"
        />
        Size
        <input
          type="number"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
          min="1"
          max="100"
          className="text-white m-1 ml-2"
          placeholder="size"
        />
        {addingText && (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Wpisz tekst"
          />
        )}
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={addingText ? addTextToCanvas : startDrawing}
        onMouseUp={addingText ? null : finishDrawing}
        onMouseMove={draw}
        className="bg-white canvass"
      />
    </>
  );
};

export default DrawingBoard;
