import React, { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { useAppDispatch } from "../../store/store";
import { getEventByIdThunk } from "../../redux/events/eventsSlice";
import {
  useAllParticipants,
  useEventsById,
} from "../../redux/selectors/selectorHooks";
import { EventImages } from "./EventImage";
import { getEventParticipantsThunk } from "../../redux/participants/participantsSlice";
import { Spin } from "antd";
import { buttonTw } from "../../tailwind/tailwindClassNames";
import parse from "html-react-parser";

export const EventDetails = () => {
  const dispatch = useAppDispatch();
  const [match, params] = useRoute("/events/:id");
  const eventId = params?.id || "";
  const event = useEventsById(eventId);
  const participants = useAllParticipants();

  useEffect(() => {
    if (params?.id) {
      dispatch(getEventByIdThunk(params?.id));
      dispatch(getEventParticipantsThunk(params?.id));
    }
  }, [params?.id]);

  if (!event) {
    return <Spin />;
  }

  return (
    <>
      <EventImages images={event.images} />

      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center">
          <div className="lg:flex-1 lg:pl-8 mt-6 lg:mt-0">
            <h2 className="text-5xl font-extrabold text-indigo-900 mb-6 border-b-2 border-indigo-500 pb-2">
              {event.title}
            </h2>
            <p className="text-left text-lg text-gray-700 leading-relaxed mb-8">
              {parse(event.description)}
            </p>
            <div className="flex items-center mb-6">
              <span className="font-semibold text-lg text-indigo-800 mr-2">
                Date:
              </span>
              <span className="text-gray-600 text-lg">
                {new Date(event.eventDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center mb-6">
              <span className="font-semibold text-lg text-indigo-800 mr-2">
                Location:
              </span>
              <span className="text-gray-600 text-lg">
                {event.latitude}, {event.longitude}
              </span>
            </div>

            <div className="flex justify-end mt-8">
              <Link
                href={`/events/register/${params?.id}`}
                className={`${buttonTw} mt-6 text-white`}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-4xl font-extrabold text-indigo-900 mb-6 border-b-2 border-indigo-500 pb-2">
          Participants
        </h3>
        {participants.length === 0 ? (
          <p className="text-lg text-gray-600">
            No participants currently registered for this event. Be the first
            one to register!
          </p>
        ) : (
          <ul className="space-y-4">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className="p-4 bg-gray-100 rounded-lg shadow"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-2 md:mb-0">
                    <h4 className="text-lg font-semibold">
                      {participant.fullName}
                    </h4>
                    <p className="text-gray-600">{participant.email}</p>
                  </div>
                  <div className="text-gray-500">
                    <p className="mb-1">
                      <span className="font-semibold">Date of Birth: </span>
                      {new Date(participant.dateOfBirth).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Discovered via: </span>
                      {participant.sourceOfEventDiscovery}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
