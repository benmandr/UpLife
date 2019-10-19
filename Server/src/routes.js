import Routes from "../utils/routes";
import userController from "./controls/user";
import categoryController from "./controls/category";
import diaryController from "./controls/diary";
import habitController from "./controls/habit";
import habitTimeController from "./controls/habitTime";
import recordController from "./controls/record";
import routineController from "./controls/routine";
import sessionController from "./controls/session";
const routes = {
  userRouter: Routes(userController),
  categoryRouter: Routes(categoryController),
  diaryRouter: Routes(diaryController),
  habitRouter: Routes(habitController),
  habitTimeRouter: Routes(habitTimeController),
  recordRouter: Routes(recordController),
  routineRouter: Routes(routineController),
  sessionRouter: Routes(sessionController)
};

export default routes;
