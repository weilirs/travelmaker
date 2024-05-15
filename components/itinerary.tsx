"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const calculateArrivalTimes = (departureTime, stops) => {
  console.log(stops);
  const baseTime = new Date();
  const [hours, minutes] = departureTime.split(":");
  baseTime.setHours(hours, minutes, 0); // Sets departure time, assuming today as the date

  return stops.map((stop, index) => {
    // Calculate total duration up to this stop, including stay durations of previous stops

    const durationSeconds =
      stops
        .slice(0, index)
        .reduce(
          (total, curr) =>
            total + curr.duration.value + (curr.stayDuration || 0),
          0
        ) + stop.duration.value;
    const arrivalTime = new Date(baseTime.getTime() + durationSeconds * 1000); // Convert seconds to milliseconds
    return {
      ...stop,
      arrivalTime: arrivalTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });
};

const handleDownloadPDF = () => {
  const input = document.getElementById("itinerary-content"); // The id of the div you want to convert to PDF
  html2canvas(input, { scale: window.devicePixelRatio || 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0);
    pdf.save("itinerary.pdf"); // Name of the downloaded PDF file
  });
};
const Itinerary = ({ stops, sunRise, sunSet }) => {
  const [departureTime, setDepartureTime] = useState(null);
  const [adjustedStops, setAdjustedStops] = useState(stops);

  useEffect(() => {
    setAdjustedStops(stops); // Reset stops when the props change
  }, [stops]);

  const itinerary = departureTime
    ? calculateArrivalTimes(departureTime, adjustedStops)
    : [];

  const handleStayDurationChange = (index, value) => {
    const newStops = adjustedStops.map(
      (stop, i) =>
        i === index ? { ...stop, stayDuration: parseInt(value, 10) * 60 } : stop // Convert minutes to seconds
    );
    setAdjustedStops(newStops);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(adjustedStops);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log(items);
    setAdjustedStops(items);
  };

  return (
    <div>
      <p>{sunRise && `Sunrise: ${sunRise}`}</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stops">
          {(provided) => (
            <div
              className=" p-6 rounded-lg  mx-auto my-8  "
              id="itinerary-content"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="flex justify-between items-center my-4">
                {" "}
                {/* Flex container */}
                <Draggable draggableId="first" key="first" index={0}>
                  {(provided) => (
                    <p
                      className=" text-gray-700 bg-[#faedcd] rounded-lg pl-4 py-6 mr-4 w-240 font-bold"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {stops[0]?.start_address}
                    </p>
                  )}
                </Draggable>
                {/* Assuming the first stop is the departure location */}
                <div>
                  <label
                    htmlFor="appt-time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Departure Time:
                  </label>
                  <input
                    className="p-2 w-30 border-none rounded-md shadow-sm text-lg transition-all duration-300 font-mono focus:outline-none focus:ring-1 focus:ring-[#faedcd]  placeholder-[#faedcd] bg-[#faedcd]"
                    type="time"
                    id="appt-time"
                    name="appt-time"
                    onChange={(e) => setDepartureTime(e.target.value)}
                  />
                </div>
              </div>

              {itinerary.map((stop, index) => (
                <Draggable
                  key={stop.id || index} // Fallback to index if id is undefined
                  draggableId={stop.id || `stop-${index}`} // Generate a unique ID if stop.id is undefined
                  index={index + 1}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex justify-between items-center"
                    >
                      <div className="my-4 mr-4 py-4 pl-4 max-w-full bg-[#faedcd] rounded-lg text-gray-700 w-240 font-bold">
                        <p>Arrive at: {stop.arrivalTime}</p>
                        <p>{stop.end_address}</p>
                      </div>
                      {index < itinerary.length - 1 && (
                        <div className="flex-column justify-between items-center">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor={`stay-duration-${index}`}
                          >
                            Stay For(mins):
                          </label>
                          <input
                            className="p-2.5 w-20 border-none rounded-md shadow-sm text-lg transition-all duration-300 font-mono focus:outline-none focus:ring-1 bg-[#faedcd]"
                            type="number"
                            id={`stay-duration-${index}`}
                            value={(stop.stayDuration || 0) / 60} // Convert seconds to minutes for display
                            onChange={(e) =>
                              handleStayDurationChange(index, e.target.value)
                            }
                            min="0"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <p>{sunSet && `Sunset: ${sunSet}`}</p>
      <button
        onClick={handleDownloadPDF}
        className="p-2 bg-[#e9edc9] text-gray rounded-lg font-bold"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default Itinerary;
