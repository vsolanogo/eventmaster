import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  PayloadAction,
  createAction,
} from "@reduxjs/toolkit";
import { Event, ErrorMessage } from "../../models/UserModels";
import { createEvent, getEvents, getEventById } from "../../api/eventApi";
import { ApiStatus } from "../../constants";
import { SortOrderType } from "../../helpers/types/types";

export type EventsState = {
  postEventsStatus: ApiStatus;
  getEventsStatus: ApiStatus;
  error: ErrorMessage | null;
  totalCount: number;
  limit: number;
  page: number;
  totalPages: number;
  eventDateSort: SortOrderType;
};

export const eventsState: EventsState = {
  postEventsStatus: "IDLE",
  getEventsStatus: "IDLE",
  error: null,
  totalCount: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
  eventDateSort: "ASC",
};

const eventsAdapter = createEntityAdapter({
  selectId: (i: Event) => i.id,
  sortComparer: (a, b) =>
    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
});

export const getEventsThunk = createAsyncThunk("events/list", getEvents);

export const getEventByIdThunk = createAsyncThunk(
  "events/getById",
  getEventById
);

export const postEventThunk = createAsyncThunk("events/create", createEvent);

export const setPage = createAction<number>("events/setPage");
export const setEventsLimit = createAction<number>("events/setEventsLimit");

export const eventsSlice = createSlice({
  name: "events",
  initialState: { ...eventsState, ...eventsAdapter.getInitialState() },
  reducers: {
    addOne: eventsAdapter.addOne,
    upsertOne: eventsAdapter.upsertOne,
    upsertMany: eventsAdapter.upsertMany,
    addMany: eventsAdapter.addMany,
    removeAll: eventsAdapter.removeAll,
    removeOne: eventsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(setPage, (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    });

    builder.addCase(setEventsLimit, (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    });

    builder.addCase(
      postEventThunk.pending,
      (state, action: PayloadAction<any>) => {
        state.postEventsStatus = "PENDING";
        state.error = null;
      }
    );
    builder.addCase(
      postEventThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.postEventsStatus = "SUCCESS";
      }
    );
    builder.addCase(
      postEventThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.postEventsStatus = "ERROR";
        state.error = action.payload;
      }
    );

    builder.addCase(
      getEventsThunk.pending,
      (state, action: PayloadAction<any>) => {
        state.getEventsStatus = "PENDING";
        state.error = null;
      }
    );
    builder.addCase(
      getEventsThunk.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log({ action });
        state.totalCount = action.payload.totalCount;
        const numberOfPages = Math.ceil(
          action.payload.totalCount / state.limit
        );
        state.totalPages = numberOfPages;
        state.getEventsStatus = "SUCCESS";
      }
    );
    builder.addCase(
      getEventsThunk.rejected,
      (state, action: PayloadAction<any>) => {
        state.getEventsStatus = "ERROR";
        state.error = action.payload;
      }
    );
  },
});

export const {
  selectIds: selectEventsIds,
  selectEntities: selectEventsEntities,
  selectAll: selectAllEvents,
  selectTotal: selectTotalEvents,
  selectById: selectEventsById,
} = eventsAdapter.getSelectors();
