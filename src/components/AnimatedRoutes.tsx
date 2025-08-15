import { Outlet, Route, Routes ,useLocation} from "react-router-dom";
import Home from "../pages/Home";
import NoMatch from "../pages/NoMatch";
import { AnimatePresence } from "framer-motion";
import CheckDevice from "../pages/CheckDevice";
import InitData from "../pages/InitData";
import VideoDetial from "../pages/video/VideoDetial";
import CategoriesPage from "../pages/CategoriesPage";
import SearchPage from "../pages/SearchPage";
import AlbumDetial from "../pages/album/AlbumDetial";
import AlbumContent from "../pages/album/AlbumContent";
import GamePage from "../pages/GamePage";
import MyPage from "../pages/my/MyPage";
import CosLoginPage from "../pages/login/CosLoginPage";
import CosRegistPage from "../pages/login/CosRegistPage";
import CosForgetPwdPage from "../pages/login/CosForgetPwdPage";
import SwpPage from "../pages/my/SwpPage";
import InviteCodePage from "../pages/my/InviteCodePage";
import FeedbackPage from "../pages/my/FeedbackPage";
import CosFavoritePage from "../pages/my/account/CosFavoritePage";
import CosViewPage from "../pages/my/account/CosViewPage";
import AccountPage from "../pages/my/account/AccountPage";
import ChangePasswordPage from "../pages/my/account/ChangePasswordPage";
import CosSponsorPage from "../pages/my/account/CosSponsorPage";
import CosSponsorMainPage from "../pages/sponsor/CosSponsorMainPage";


const Layout = () => {
  /*
  const navigate = useNavigate();
  useEffect(() => {
    if(!dataCenter.isCheckedDevice) {
      navigate("/checkDevice");
    }
  }, [navigate]);
*/
  return (
    <>
      {/** 
      <nav>
            <Link to="/">Home</Link>
            <Link to="/checkDevice">CheckDevice</Link>
            <Link to="/testAd">TestAd</Link>
      </nav>
      */}
        <div style={{backgroundColor:'black',color:'white',height:'100%'}}>
            <Outlet />
        </div>
        
      
    </>
  );
};

const AnimatedRoutes = () => {
    const location = useLocation();
  return (
    <AnimatePresence mode="popLayout">

        <Routes location={location} key={location.pathname}>
          <Route path="/checkDevice" element={<CheckDevice />} />
          <Route path="/init" element={<InitData />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<CheckDevice />} />
            <Route path="home" element={<Home />} />
            <Route path="categoriesPage/:chid?/:sub_chid?/:page?" element={<CategoriesPage />} />
            <Route path="videoDetial/:videoId" element={<VideoDetial />} />
            <Route path="albumDetial/:albumId/:photoUrl?" element={<AlbumDetial />} />
            <Route path="albumContent/:albumId" element={<AlbumContent />} />
            <Route path="game/:cid?/:page?" element={<GamePage />} />
            <Route path="sponsor" element={<CosSponsorMainPage />} />
            <Route path="my" element={<MyPage />} />
            <Route path="my/swp/:page" element={<SwpPage />} />
            <Route path="my/invite" element={<InviteCodePage />} />
            <Route path="my/feedback" element={<FeedbackPage />} />
            <Route path="my/favorite/:type?/:page?" element={<CosFavoritePage />} />
            <Route path="my/view/:type?/:page?" element={<CosViewPage />} />
            <Route path="my/account" element={<AccountPage />} />
            <Route path="my/sponsor/:page?" element={<CosSponsorPage />} />
            <Route path="my/account/changePassword" element={<ChangePasswordPage />} />
            <Route path="search/:type/:queryStr?/:page?" element={<SearchPage />} />
            <Route path="login/:account?" element={<CosLoginPage />} />
            <Route path="register" element={<CosRegistPage />} />
            <Route path="forgetPwd" element={<CosForgetPwdPage />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>

    </AnimatePresence>
  );
};

export default AnimatedRoutes;
