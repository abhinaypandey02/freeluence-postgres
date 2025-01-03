"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "ui/input";
import { Button } from "ui/button";
import Pusher from "pusher-js";
import { getConversationChannelName, NEW_MESSAGE } from "config/events";
import type {
  GetChatQuery,
  GetCurrentUserQuery,
} from "../../../../__generated__/graphql";
import { useAuthMutation } from "../../../../lib/apollo-client";
import { READ_MESSAGE, SEND_CHAT } from "../../../../lib/mutations";
import { useToken } from "../../../../lib/auth-client";

interface FormValues {
  text: string;
}

export default function ChatWindow({
  chat,
  user,
}: {
  chat: NonNullable<GetChatQuery["chat"]>;
  user: NonNullable<GetCurrentUserQuery["user"]>;
}) {
  const token = useToken();
  const { register, handleSubmit, resetField } = useForm<FormValues>();
  const [sendMessage] = useAuthMutation(SEND_CHAT);
  const [readMessage] = useAuthMutation(READ_MESSAGE);
  const [messages, setMessages] = useState<
    {
      body: string;
      sender: number;
      sentAt: string;
      failed?: boolean;
      loading?: boolean;
    }[]
  >(chat.messages.toReversed());
  function onSubmit(data: FormValues) {
    const index = messages.length;
    resetField("text");
    setMessages((old) => [
      ...old,
      {
        body: data.text,
        sentAt: new Date().toISOString(),
        sender: user.id,
        loading: true,
      },
    ]);
    sendMessage({
      body: data.text,
      conversationID: chat.id,
    })
      .then(() => {
        setMessages((old) => {
          if (old[index]) old[index].loading = false;
          return [...old];
        });
      })
      .catch(() => {
        setMessages((old) => {
          if (old[index]) old[index].failed = true;
          return [...old];
        });
      });
  }
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      channelAuthorization: {
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/pusher`,
        transport: "ajax",
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    pusher.subscribe(getConversationChannelName(chat.id));
    pusher.bind(
      NEW_MESSAGE,
      (message: NonNullable<GetChatQuery["chat"]>["messages"][number]) => {
        if (message.sender !== user.id) {
          void readMessage({
            conversationID: chat.id,
          });
          setMessages((old) => [
            ...old,
            {
              body: message.body,
              sender: message.sender,
              sentAt: `${message.sentAt}`,
            },
          ]);
        }
      },
    );
    return () => {
      pusher.unbind();
      pusher.unsubscribe(getConversationChannelName(chat.id));
    };
  }, [chat.id, readMessage, token, user.id]);

  return (
    <div>
      {messages.map((msg) => (
        <div
          className={`flex ${msg.sender === user.id ? "justify-end" : "justify-start"}`}
          key={msg.sentAt}
        >
          <div>
            {msg.body}
            <br /> {msg.loading ? "(Sending)" : null}{" "}
            {msg.failed ? "Failed" : null}{" "}
            {!msg.loading && !msg.failed && new Date(msg.sentAt).toTimeString()}
          </div>
        </div>
      ))}
      <form className="flex " onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("text")} />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
