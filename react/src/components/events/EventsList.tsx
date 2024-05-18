import React, { useEffect } from "react";
import { useAppDispatch } from "../../store/store";
import {
  getEventsThunk,
  setEventsLimit,
  setPage,
} from "../../redux/events/eventsSlice";
import {
  useAllEvents,
  useEventsLimit,
  useEventsPage,
  useTotalCount,
} from "../../redux/selectors/selectorHooks";
import { Pagination } from "antd";
import { Link } from "wouter";
import { buttonTw } from "../../tailwind/tailwindClassNames";
import parse from "html-react-parser";

export const EventsList = () => {
  const dispatch = useAppDispatch();
  const totalCount = useTotalCount();
  const events = useAllEvents();
  const page = useEventsPage();
  const pageSize = useEventsLimit();

  useEffect(() => {
    dispatch(getEventsThunk(undefined));
  }, [page, pageSize]);

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-end mb-4">
          <div className="mr-4">
            <label htmlFor="sort" className="mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              // value={sortBy}
              // onChange={handleSortChange}
            >
              <option value="">Select</option>
              <option value="title">Title</option>
              <option value="eventDate">Event Date</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <div className="mr-4">
            <label htmlFor="order" className="mr-2">
              Sort order:
            </label>
            <select
              id="order"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              // value={sortOrder}
              // onChange={handleOrderChange}
            >
              <option value="">Select</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((i) => (
            <div
              className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden"
              key={i.id}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{i.title}</h2>
                <p className="text-gray-700 mb-4"> {parse(i.description)}</p>
                <div className="flex justify-end space-x-4">
                  <Link
                    href={`/events/register/${i.id}`}
                    className={`${buttonTw} mt-6 text-white`}
                  >
                    Register
                  </Link>

                  <Link
                    href={`/events/${i.id}`}
                    className={`${buttonTw} mt-6 text-white bg-green-500 text-white py-2 px-4 rounded`}
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Pagination
        onChange={(e) => {
          dispatch(setPage(e));
        }}
        onShowSizeChange={(current, size) => {
          dispatch(setEventsLimit(size));
        }}
        total={totalCount}
        defaultCurrent={1}
        defaultPageSize={10}
        current={page}
      />
    </>
  );
};
