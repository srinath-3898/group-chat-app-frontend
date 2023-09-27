import { Dropdown } from "antd";

const MyDropdown = ({ items, buttonItem, placement }) => {
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        placement={placement ? placement : "bottomRight"}
        trigger={["click"]}
      >
        {buttonItem}
      </Dropdown>
    </>
  );
};
export default MyDropdown;
