import React, { useEffect } from "react";
import styles from "./Invitation.module.css";
import { Spin, message } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateInvitation } from "@/store/invitation/invitationActions";
import { resetInvitationData } from "@/store/invitation/invitationSlice";
import { getInvitations } from "@/store/invitations/invitationsActions";
import { getAllChats } from "@/store/chats/chatsActions";

const Invitation = ({ invitation, setInvitation }) => {
  const dispatch = useDispatch();

  const {
    loading: invitationLoading,
    message: invitationMessage,
    error: invitationError,
  } = useSelector((state) => state.invitations);

  const [messageApi, contextHolder] = message.useMessage();

  const handleInvitaionButtonClick = (status) => {
    dispatch(
      updateInvitation({
        status,
        invitationId: invitation?.id,
      })
    ).then((response) => {
      dispatch(resetInvitationData());
      if (response?.payload?.data?.status) {
        setInvitation(null);
        dispatch(getInvitations()).then((response) => {
          if (response?.payload?.data?.status) {
            dispatch(getAllChats());
          }
        });
      }
    });
  };

  useEffect(() => {
    if (invitationMessage || invitationError) {
      messageApi.open({
        content: invitationMessage ? invitationMessage : invitationError,
        icon: invitationMessage ? (
          <CheckCircleFilled style={{ color: "#008069" }} />
        ) : (
          <CloseCircleFilled style={{ color: "red" }} />
        ),
      });
      dispatch(resetInvitationData());
    }
  }, [invitationMessage, invitationError]);

  return (
    <>
      {contextHolder}
      <div
        className={`${styles.container_2_box_2} ${styles.container_2_box_2_res}`}
      >
        <p className="text-small">You have been invited to join this group</p>
        <div className={styles.invitation_buttons}>
          <button
            className="btn_secondary"
            onClick={() => handleInvitaionButtonClick(false)}
          >
            {invitationLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ color: "#ffffff", fontSize: "16px" }}
                  />
                }
              />
            ) : (
              "Reject"
            )}
          </button>
          <button onClick={() => handleInvitaionButtonClick(true)}>
            {invitationLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ color: "#ffffff", fontSize: "16px" }}
                  />
                }
              />
            ) : (
              "Accept"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Invitation;
