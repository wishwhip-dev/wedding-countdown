# Plan

Goal: A countdown to our wedding with both our names at the top, the days, hours and minutes left, and a short list of the last things we still need to do before the day.

1. The page opens with both partners' names shown prominently at the top as a heading ('Dhama & Dhama'), seeded with these names and a default wedding date of 25 November this year (with a default time of day, e.g. midday).
2. Three readouts show the time remaining — days, hours and minutes — and they tick down every minute without a page reload; hours and minutes are zero-padded to two digits (e.g. '05 h 42 m') so the row reads cleanly.
3. An 'Edit details' button opens a dialog with two name inputs plus a date and time-of-day picker for the ceremony; saving updates the heading and the countdown immediately.
4. The countdown is computed from the wedding date stored in the Dexie database, so after a reload it still counts down to the same date and time.
5. When the wedding date and time have passed — including when the past date is set through the edit dialog — the countdown area shows a 'We're married!' message with the wedding date, instead of negative numbers.
6. The checklist shows at least 6 pre-seeded wedding tasks (such as 'Send invitations', 'Book photographer', 'Order cake'), each with a checkbox; ticking one strikes it through and updates an 'X of Y done' readout next to the list.
7. An 'Add task' button — plain, visible and enabled — opens a dialog with a text input; submitting adds the task at the end of the list immediately, and new tasks start unchecked.
8. Submitting the add-task dialog with empty or whitespace-only text adds nothing: no empty row appears, the dialog stays open and the input is focusable so the text can be corrected.
9. Each task can be removed with a delete button on its row, and the done-count readout updates to match; after the last task is removed the list shows a friendly 'no tasks yet' message with the count reading '0 of 0 done', and adding a task brings the list back.
10. Saving the edit dialog with either name field left blank does not wipe that name — the previous value is kept and an inline message asks for a name.
11. Reloading the page keeps everything: edited names, the chosen wedding date and time, and the task list with its completed states, all persisted in the browser database.
12. All controls work from the keyboard: the add and edit dialogs open via Enter, their inputs are reachable by Tab, submission works via Enter, and checkboxes toggle with Space.
13. On a phone-sized viewport (375px wide) the countdown readouts, checklist and dialogs fit without horizontal scrolling, and long task names wrap inside their row instead of pushing the delete button off-screen.

These are the outcomes this task is judged against.

## The owner's answers

- Q: What are your two names, and what is the date and time of the wedding?
  A: dhama and dhama on 25th nov this year

Build to these answers; they override any assumption the plan made.