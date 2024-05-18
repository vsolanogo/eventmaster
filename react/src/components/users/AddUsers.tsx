import { useAppDispatch, useAppSelector } from "../../store/hooks";
import React, { useState } from "react";
import { addUser } from "../../redux/activeUser/activeUserSlice";
import { v4 as uuidv4 } from "uuid";

type AddUsersProps = {};

const initialState = {
  name: "",
  email: "",
};

const AddUsers = (props: AddUsersProps) => {
  const dispatch = useAppDispatch();
  const isAddingUser = useAppSelector(
    (state) => state.users.addUserStatus === "PENDING",
  );
  const [form, setForm] = useState(initialState);

  const onAddUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    await dispatch(
      addUser({
        id: uuidv4(),
        ...form,
      }),
    );
    setForm(initialState);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Add users</h2>
      <form className="space-y-3">
        <div className="flex flex-col items-stretch text-left space-y-2">
          <label className="font-semibold" htmlFor="name">
            Name
          </label>
          <input
            className="flex-grow px-4 py-3"
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col items-stretch text-left space-y-2">
          <label className="font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="flex-grow px-4 py-3"
            type="text"
            name="email"
            id="email"
            value={form.email}
            onChange={onChange}
          />
        </div>
        <button
          className="w-28 self-end bg-blue-700 text-blue-100 px-4 py-3"
          onClick={onAddUser}
          disabled={isAddingUser}
        >
          {isAddingUser ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
