# MAIN Prompt

Go through `15_PRACTICE_COMPONENT_UI_STANDARD.md` file under `docs` folder and understand all requirment or changes. Then create a Tasks under `docs/tasks` folder.

## Rules

- Ask questions only if required info is missing.
- Read requirements doc → create tasks → execute → update progress as you go.
- Naming convention for .md file in docs and tasks folder -> examples `15_PRACTICE_COMPONENT_UI_STANDARD.md` for docs file and for task file `15_PRACTICE_COMPONENT_UI_STANDARD_TASKS.md`
- Use check box to mark tasks completion so user can know what done and what not.
- Update progress as you work.
- Update `public/github/branches-progress.md` with latest branch
- When all tasks done → add lessons to `docs/learning/LESSONS_LEARNED.md`.

# GIT Commit

fix: UI issues fix for blog page cards; check docs - `16_LOGIN_UI_IMPROVMENT.md` & task - `16_LOGIN_UI_IMPROVMENT_TASKS.md`

## UI Inspection Prompt

## Daily tacker UI issues - 27 march 2026

Fix the UI issue on daily tracker page. For screen small than XL arrange analytics tab below the view tabs for adding daily and recurring task. Also remove dark & light mode support for them keep them in light mode always.

## Prompt 3 - Sidebar collapse - 27 march 2026

I want trigger at top to collapse sidebar of study-tracker page. On Collapse right side main container should take full widht. And left side sidebar should show icons only.

## Prompt 4 - Sidebar collapse - 27 march 2026

For daily tracker page do analysis using for below suggetions and then create plan in docs folder with id 19.

- Create clear all data button at top right side near import/export button. WHich will clear only data related to daily-tracker page.
- create api route to handle this clearn data.
- remove localstorage data also and sync if user is logged in if not then clear data only. Also if user is logged out and he login again them sync the changes
- Improve the prisma model to store daily task & habbits for one users -> use array, json with userid (if this save our money else keep as it is)
- Also check fetch daily-tracker route if make changes to prisma model or any code changes
- Improve the UI of top date bar as for larger screen size not look good above 2xl
- Also for recurring habits change UI make it simple with less customisation. and time mandatory (time in min). Also add new input to ask user about the task planned time like - example: go to gym 60min 5pm-6pm.
  - Keep Start date and end date selection
  - Duration - keep 1week, 2week, 3week, 1month, custome & remove indefinite, 2months
  - Repeat - remove this option.
  - keep start date, end date in one line also reduce create habbit button size and create cancel button on left side -> upon clicking go to daily tasks.
  - Improve ui but keep css colors, style same i dont want to use shadcn components
- For completion rate chart should show data in sync with habit tracker chart like filter from habit tracker can change completion rate chart.
- Also remove progress chart from Habit tracker end and show below completion rate with there respective progress and habbit infront of it als for this show time slot infront of habbit names (in nice ui way)
- Remove weekly/monthly filter from analytics card which is present at top. Add habit tracjer filter there and update below charts as per those filters including top cards of items done, total items, completion, time done.

## Prompt 5 - Pending todos - 29 march 2026

create new page pending todos where show all the todos those are not completed in table format. Show new field `reason` for each todo and its not required field. Table should have date and todo filter. Create api routes and logic with proper response for each error and success. Update prisma model to fit new column to store reason. Put that tab after reucurring habits tabs. Also show checkbox to mark it complete. Also show table in todays date first then yesterday date likewise.

## Prompt 6 - todos - 29 march 2026
