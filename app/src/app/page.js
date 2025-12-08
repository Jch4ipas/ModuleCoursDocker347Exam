"use client";

import { loadData } from "@/services/loadJSON";
import { buildBoxes } from "@/components/buildBoxe"
import { useState, useEffect } from "react";
import './globals.css';

export default function Home() {

  const [ boxSerializable, setBoxSerializable ] = useState([]);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ allBoxSets, setAllBoxSets ] = useState([]);
  const [ activeBoxSet, setActiveBoxSet ] = useState(0);
  const [ durationDisplayCurrentContainer, setDurationDisplayCurrentContainer ] = useState(30);
  const [ refreshItem, setRefreshItem ] = useState(0);
  const [ selectedContainer, setSelectedContainer ] = useState([]);

  useEffect(() => {
    handleLoad();
  }, []);
  const handleLoad = async () => {
      const res = await loadData();
      setBoxSerializable(res);
      setIsLoaded(true);
  }
  useEffect(() => {
    if (isLoaded) {
      const displayableContainers = boxSerializable.filter(container => container.isGoingToDisplay == true);
      const boxdisplay = displayableContainers.map((container, index) => index);
      setAllBoxSets(boxdisplay);
      const theBoxe = displayableContainers[boxdisplay[activeBoxSet]];
      setSelectedContainer(theBoxe ? buildBoxes(theBoxe.boxes) : []);
      setDurationDisplayCurrentContainer(theBoxe?.durationDisplay || 30);
    }
  }, [isLoaded, boxSerializable, activeBoxSet])
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveBoxSet((prev) => (prev + 1) % allBoxSets.length);
    }, durationDisplayCurrentContainer * 1000);

    return () => clearInterval(intervalId);
  }, [durationDisplayCurrentContainer]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setRefreshItem(prev => prev + 1);
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);
  useEffect(() => {
    const evt = new EventSource("/api/events");
    evt.onmessage = (event) => {
      if (event.data === "update") {
        handleLoad();
      }
    };
    return () => evt.close();
}, []);
  return (
      <div className="h-screen w-full home-page">
        <div className="grid grid-cols-6 grid-rows-4 gap-2 w-full h-full p-2">
          {Array.isArray(selectedContainer) && selectedContainer.map((box) => (
            <div
              key={box.id}
              className={`border border-gray-600 rounded-3xl justify-center items-center font-bold shadow-md p-2`}
              style={{
                gridColumn: `${box.x} / span ${box.width}`,
                gridRow: `${box.y} / span ${box.height}`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                {box.content}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}