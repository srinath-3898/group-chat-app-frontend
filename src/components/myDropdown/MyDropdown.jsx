import { Dropdown } from "antd";

const MyDropdown = ({ items, buttonItem, placement }) => {
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        placement={placement ? placement : "bottomRight"}
        arrow
        trigger={["click"]}
      >
        {buttonItem}
      </Dropdown>
    </>
  );
};
export default MyDropdown;
