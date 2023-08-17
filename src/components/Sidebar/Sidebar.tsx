import GameMenu from "../GameMenu/GameMenu";
import HistoryComponent from "../HistoryComponent/HistoryComponent";

const Sidebar = () => {
  return (
    <div className="h-full self-start rounded-md bg-background-secondary py-2 shadow-md max-sm:my-4 max-sm:w-11/12">
      <GameMenu />
      <HistoryComponent />
    </div>
  );
};

export default Sidebar;
