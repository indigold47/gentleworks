/* ------------------------------------------------------------------ */
/*  Branded HTML email template for contact form submissions           */
/* ------------------------------------------------------------------ */

/** Inline logo as base64 data URI — works in all email clients without external requests. */
const LOGO_SRC = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQXJ0d29yayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTE5MS41NiA4MS4yOSI+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogI2Y1ZjBlODsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik04MC45Myw0NC4wNmMtMSwuMDctMi45My4xOS00LjcxLjE5aC0uODdjLTMuNDEsMC0xMS4zOC0uMDEtMTMuMjguMjItMS44OC4yMy0xMS4wMy4zMS0xMi4wNy4zMS0uNDcsMC0uODUuMzYtLjkuODJsLS4xOSwyLjA1Yy0uMDMuMjUuMDYuNS4yMy42OS4xNy4xOS40MS4zLjY3LjMuOTUsMCwzLjQ2LjEsNi4yNi43NCwzLjQ0Ljc5LDMuOTMsNC40Nyw0LjE0LDYuMDQuMjMsMS43My4xLDEwLjcyLTIuMTEsMTQuMDYtMi4yMywzLjM2LTguNjksNS45OC0xMi45Nyw2LjA5LTQuMy4xMS0xMC4yOS0uNTItMTQuMjUtMi41OS0zLjc2LTEuOTYtNy42MS00LjU1LTEwLjMxLTEwLjEzLTIuNjQtNS40Ny0zLjg5LTEwLjkyLTQuMDItMTcuNjctLjEyLTUuNzEuMTItMTQuMDYsMS45NS0yMS40NCwxLjg1LTcuNDgsNC4yNS0xMS43LDcuOC0xMy42OSw0LjMzLTIuNDMsMTAuMTMtNS4xNiwxNi41MS00Ljc0LDcuMDUuNDksMTMuMzEsNC4wOCwxNi40Miw2LjE4LDIuOSwxLjk2LDQuODMsNS44Niw1Ljc1LDcuNzMuMjIuNDQuMzguNzguNTEuOTkuMzYuNiwxLjE3LDMuNTEsMi4xMyw3LjU4LjExLjQ2LjUyLjc5LDEsLjc5aDEuNDljLjI4LDAsLjU0LS4xMS43My0uMzEuMTktLjIuMy0uNDYuMjktLjczLDAtLjEzLDAtLjI2LS4wMi0uNDEtLjAxLS4xOCwwLTEuNjMuMDMtMy4zLjA0LTMuMTEuMDktNy4zOC4wNS05Ljg1LS4wNi0zLjM0LS41My03Ljc4LS42OC05LjA2LS4wNS0uNDItLjQyLS43NS0uODMtLjcybC0yLjAyLjA3aDBjLS41MS4wMi0uOTQuNDItLjk5LjkzLS4wNS41Ny0uMTgsMS43NC0uNDIsMy4xNS0uMiwxLjIzLS41LDIuMzItLjcyLDMuMDItLjAyLjA1LS4wNS4wNy0uMDguMDgtLjAyLDAtLjA3LjAxLS4xMS0uMDMtMy4xNC0yLjkzLTcuNTEtNS42MS0xMC4yNC02Ljg3LTIuNTMtMS4xNi04LTMuMDQtMTYuMTgtMi41Ny03LjU1LjQ0LTEyLjA1LDIuMTUtMTUuNzksMy45My0zLjg4LDEuODUtMTAuNzYsOC4xOS0xMy42MiwxMi41Ny0yLjg1LDQuMzUtNi4wMywxMi41OC02LjI3LDIwLjM4LS4yNSw3Ljc3LDEuOTksMTYuODYsNC4yMiwyMS40NiwyLjE2LDQuNDYsNS44NCwxMC4xMSwxNS4xOSwxNC4yNiw4Ljg0LDMuOTIsMTIuMSw0LjIsMTcuMDMsNC42MmwuNTUuMDVjLjY5LjA2LDEuNDEuMDksMi4xNS4wOSw1LjA2LDAsMTAuODUtMS4zNSwxNC4wNS0yLjg4LDMuMDQtMS40NSw2Ljc2LTIuMjcsOS43NC0yLjkzLjU2LS4xMywxLjEtLjI0LDEuNTktLjM2LDIuODItLjY1LDQuNC41Miw0LjQ3LjU3bC4zLjIzLjk4LTEuMDQtLjA1LS4yMnMtLjUtMi4yLS44NS02LjAxYy0uMzctNC4wNC0uNDUtMTEuNjksMC0xNC41My40Mi0yLjY5LDEuODEtMy4wOSw0LjM4LTMuODQsMS43OC0uNTIsMy43Mi0uNDIsNC43Mi0uMzEuMjYuMDMuNTMtLjA4LjcxLS4yNy4xOC0uMi4yNS0uNDguMTktLjc0bC0uNDUtMS45OGMtLjA5LS42LS42NC0xLjAyLTEuMjMtLjk5Wk00OS41Miw0NS42NXMwLDAsMCwwaDAsMFpNNDkuODIsNDguMjNoMHMwLDAsMCwwWiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTcxLjQzLDUyLjQybC0xLjg5LjM4Yy0uNjIuMTItMS4wOS42LTEuMjIsMS4yMi0uODQsNC4xNS0zLjExLDEwLjAzLTYuMjksMTMuOC0yLjM3LDIuODItNS43NSw0LjUyLTEwLjA0LDUuMDYtMi40OS4zMS0xMy45Mi41LTE2LjU5LS44NC0yLjU4LTEuMjktMi44OC02LjE1LTIuODMtMTEuMjEuMDMtMi45Mi0uMTItMTAtLjQ2LTIxLjA0di0uMzhjLS4wMS0uMDguMDMtLjEzLjA1LS4xNS4wMi0uMDIuMDgtLjA1LjE1LS4wNi45Mi4wNCwyLjY0LjAzLDQuNDYuMDEsMS43My0uMDEsMy41Mi0uMDMsNC42NiwwbC44Mi4wMmMyLjU3LjA1LDUuMjQuMDksNi42OSwyLjkzLDEuMjcsMi40NywxLjA3LDUuNzUuOTMsNy4wNC0uMDMuMzEuMDcuNjMuMjkuODYuMjIuMjMuNTQuMzguODQuMzNsMS4yMy0uMDZjLjYzLS4wMywxLjExLS41NSwxLjExLTEuMTctLjAxLTEuNDQtLjA3LTguNzEtLjItMTAuNzItLjEyLTEuOTMtLjIzLTEwLjIzLS4yNS0xMi43MiwwLS40Ni0uMzUtLjg0LS44MS0uODlsLTIuNzktLjMxYy0uMjktLjA0LS41Ni4wOS0uNzIuMzMtLjE2LjI0LS4xOC41NC0uMDUuOC41OSwxLjE0LDEuNSwzLjQzLjk3LDUuOTktLjY0LDMuMTMtMy4xNSwzLjIxLTUuMTcsMy4yOGwtLjQuMDJjLTEuNjMuMDctOS40Mi4yMS0xMS45Ny4yOS0uMDQtMS43My0uMi05LjA0LS4yOC0xMS44LS4wOC0yLjguMS0xNC4zOC4xNC0xNi43LDIuNzQtLjAyLDE4LjQxLS4wNiwyMS4zOC40NiwzLjE1LjU1LDYuMDYsNS4zMiw2LjUxLDYuNy4zOSwxLjE4LDEuNDksNS4xNiwxLjk1LDYuODEuMTIuNDIuNC43Ny43OC45Ny4zOC4yLjgzLjIzLDEuMjQuMDhsMS4yOC0uNDZjLjUzLS4xOS44Ni0uNy44My0xLjI2LS4wNi0xLjE1LS4yNi00LjAyLS43My01Ljc3LS40Ny0xLjc0LTEuMi03LjMxLTEuNS05LjYzLS4wOS0uNy0uNjktMS4yNC0xLjQtMS4yNS0uNzcsMC0xLjg5LDAtMi44NS4wOC0uODEuMDYtNC44NS0uMDctOC43Ni0uMi0zLjgzLS4xMy03LjQ1LS4yNi04LjM2LS4yLTEuNjEuMS0yNC44OC40NC0yOS41Mi41MS0uNi4wMS0xLjA4LjQ5LTEuMSwxLjA5bC0uMDMsMS40MmMwLC4zLjExLjU5LjMyLjguMjEuMjEuNDkuMzMuNzkuMzNoMGMxLjk1LDAsNC41NC4yNSw0LjU1LjI1LDIuNjEuNDEsMi45NiwyLjU1LDMuMiw0LjA3LjE5LDEuMTguNSwxNC40OS42MSwxOS40OWwuMDQsMS44NGMuMDMsMS4wOCwwLDUuNjgtLjA0LDExLjAxLS4wNCw1LjcyLS4wOSwxMi4yMS0uMDcsMTYuMTQuMDMsNi43NS0xLjQ3LDExLjQ4LTQsMTIuNjUtMS44LjgzLTUuMTQuMzktNi40OS4xNi0uMjctLjA1LS41NC4wMy0uNzQuMjEtLjIuMTgtLjMxLjQ0LS4yOS42OXYyLjQxYy4wMi41Ny40OSwxLjA0LDEuMDYsMS4wNGgwYzQuOS0uMDIsMjIuMzUtLjE4LDMyLjEzLS4zMiwxMC4wOC0uMTQsMjYuODQtLjI1LDI3LjU1LS4yNi42MSwwLDEuMTItLjQ4LDEuMTctMS4wOS4wOC0xLjAzLjM0LTQuNTUuNDEtNi42MS4wOC0yLjMxLjgyLTE0LjA4LjktMTUuNDIuMDItLjMyLS4xMS0uNjEtLjM1LS44Mi0uMjQtLjIxLS41NS0uMy0uODYtLjIzWiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjc5LjU2LDIuNzJjLS43NS0uMDQtMi41Ny0uMDItNC44OC4wMi0yLjE5LjAzLTQuNzkuMDctNy4xNC4wNS0yLjQ0LS4wMS00Ljg1LDAtNi45Ny4wMy0yLjUyLjAyLTQuNy4wNC01LjkxLS4wMS0uMDEsMC0uMDMsMC0uMDUsMC0uNTcsMC0xLjA2LjQ1LTEuMDksMS4wNmwuMDQsMS41NmMwLC4zNi4xNi43MS40Mi45NS4yMi4yMS41MS4zMi43OS4zLDIuODQtLjE1LDUuNTktLjAyLDcuMDIuMzQsMi4wOS41MiwzLjUzLDEuOTQsNC4yNyw0LjIuNDksMS41MS45NiwxNy42NS45NiwyMC44NSwwLDIuNjQtLjA5LDIxLjI3LS4xMSwyNi4yOC0yLjI1LTIuOTgtNy44Ny0xMC40Mi04Ljc3LTExLjUtMS4wNS0xLjI2LTE2LjE0LTE5LjctMTcuOTEtMjEuOTItMS42Ny0yLjEtOC41LTExLjY2LTEwLjI0LTE0LjEtMS4zOC0xLjk0LTMuODktNS4yNC01LjI3LTcuMDMtLjQyLS41NS0xLjA4LS44Ny0xLjc3LS44N2gtLjA0Yy0xLjg3LjA0LTUuOTguMjEtNy4xOS4zMS0xLjE4LjExLTkuMTktLjAyLTEyLjU4LS4wOGgtLjAyYy0uMjQsMC0uNDcuMDktLjY0LjI3LS4xNy4xNy0uMjcuNDEtLjI3LjY2LDAsLjM2LS4wMy45MS0uMSwxLjYtLjAzLjMyLjA4LjY0LjMyLjg2LjI0LjIyLjU2LjMyLjg4LjI4aDBjLjc4LS4xMiwyLjMtLjMyLDMuNzEtLjMyLDEuOTMsMCwzLjg1LDEuMjIsNC41NSwyLjkuNSwxLjIuNTcsNC44Mi42Niw5LjAxLjA0LDEuNzIuMDcsMy41NS4xNCw1LjM5LjI0LDYuMzkuNjksMzcuMTQuNDksNDAuNzQtLjIsMy42Mi0xLjI5LDYuMTEtMy4wNyw3LTEuODQuOTItNi45NywxLjc0LTcuNTUsMS44My0uNDEuMDYtLjcxLjQxLS43MS44MiwwLC41Ny0uMDYsMS40OC0uMTEsMi4wOC0uMDIuMjguMDguNTUuMjcuNzYuMTkuMi40Ni4zMi43NC4zMi4xMSwwLDExLjE1LjA0LDE0LjgsMCwzLjAyLS4wNCw5LjI5LS4xNCwxMS41OS0uMThoLjIxYy4yOSwwLC41Ni0uMTQuNzQtLjM2LjE5LS4yMi4yNy0uNTEuMjItLjhsLS4zMS0xLjljLS4wNy0uNDYtLjQ2LS43OS0uOTItLjgxLTQuMjEtLjEzLTcuOTktMS42My0xMC4xLTMuOTktMS45NC0yLjE4LTIuMTEtMy4yLTIuMTYtNS44LS4wMi0xLjEzLS4wNy03LjExLS4xMy0xNC4wNC0uMDgtOS42MS0uMTYtMjAuNTEtLjIyLTIzLjgzLS4wOC00Ljc2LS4xLTExLjk2LS4xLTE0LjE2LDIuMjMsMi4yNCw4LjU0LDEwLjczLDEyLjE2LDE1Ljc5LDMuNTksNS4wMSwxNi45MywyMS44NCwyMy4zOSwyOS44NSw1LjY3LDcuMDQsMTMuNjYsMTcuOSwxNS4yMSwyMCwuMy40MS43OS42NiwxLjI5LjY3bDEuNTkuMDNoLjAyYy4yMywwLC40NC0uMS41OS0uMjcuMTYtLjE4LjIzLS40MS4yLS42NS0uMDYtLjQyLS4xNS0xLjMxLS4xMi0yLjQ0LjA1LTEuODYuMS0yMi4xNywwLTI4LjA4LS4xLTUuOTktLjI1LTI5LjMxLS4wNS0zMi4wMS4wMi0uMjYuMDMtLjUyLjA1LS43Ny4xNC0yLjM2LjI0LTQuMDcsMy4zMy01LjY2LDIuNzUtMS40MSw1LjIyLTEuNTUsNi4xNi0xLjUxLjIzLjA0LjQ2LS4wOS42MS0uMjYuMTYtLjE3LjI0LS40LjIyLS42M2wtLjE1LTEuODdjLS4wNS0uNTQtLjQ5LS45Ni0xLjAzLS45OVoiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM3Ny4xLDQuNmMtLjAzLS43My0uNjQtMS4zMS0xLjM3LTEuMzEtLjAxLDAtLjAzLDAtLjA0LDAtMi42Ny4wOC05LjE5LjA0LTEzLjk2LDAtMi43LS4wMS00LjkyLS4wMy01Ljc5LS4wMi0uOTIuMDItNC40LS4wMi04LjQ0LS4wNi04LjI5LS4wOC0xOC42MS0uMTgtMTkuODMtLjA0LTEuNTguMTktMTYuNjIuMDQtMTkuNjIsMGgtLjAxYy0uMzYsMC0uNjkuMTUtLjkzLjQyLS4yNC4yNy0uMzUuNjMtLjMuOTkuMS43Mi4yLDEuOTYuMiwyLjU1LDAsMS4wNy41MiwxMy41MS41MiwxMy42MywwLC4yNC4xMi40Ny4zLjYzLjE4LjE2LjQyLjI1LjY2LjIybDEuNjEtLjE0Yy41Ny0uMDUsMS4wNC0uNSwxLjEtMS4wNy4xMS0uOTMuNDUtMy40MywxLjMtNi41NC44NC0zLjA5LDQuMDEtNi41Niw3LjM3LTYuOCwzLjAyLS4yMSwxMy4xNy4wOSwxNi4yLjE4LjA4LDAsLjE1LjA3LjE1LjE1LjA2Ljc2LjE4LDIuMjYuMzUsNC4xNi41NSw2LjU0LDEuNTcsMTguNywxLjY0LDIyLjE1LjEsNC42Ny0uMTQsMjUuNjUtLjIsMjguNTMtLjA1LDIuNzEtLjYyLDguMjgtMi4zOCw5Ljk1LTEuMTgsMS4xMi01LjkxLDEuMzMtOS45NSwxLjE2LS4yNy0uMDItLjU4LjEtLjc5LjMtLjIxLjItLjMzLjQ5LS4zMy43OWwuMDMsMi4wNGMwLC40NC4zNi43OS43OS43OSwxLjE3LjAyLDcuMTUuMTIsMTAuMTYtLjA2LDEuNzEtLjEsNC4zOS0uMDQsNy4yNC4wMSwyLjY5LjA1LDUuNDguMTEsNy42NC4wNCwzLjQxLS4xMSw4LjE5LjEzLDEwLjA4LjIzLjAzLDAsLjA1LDAsLjA4LDAsLjM1LDAsLjY5LS4xNC45NS0uMzguMjgtLjI2LjQ0LS42My40NC0xLjAxdi0xLjhjMC0uMy0uMTMtLjYtLjM1LS44MS0uMjMtLjIxLS41NC0uMzMtLjgyLS4zMS00LjQ3LjIyLTcuNDkuMDgtOC45OC0uNDEtMi4yOS0uNzUtMy4wNy01LjU2LTMuMTYtNy45OS0uMS0yLjU5LjI3LTIxLjEzLjM1LTI0LjgzLjA4LTQuMTktLjM5LTI2LjEzLS41My0zMi43NiwzLjM5LS4zLDE1LjM5LjIzLDE4LjUxLjU5LDIuMDkuMjQsNC41MywzLjU0LDYuNzEsOS4wNi41NCwxLjM3LjU2LDMuMTUuNTUsMy44NSwwLC4yMi4wOS40My4yNC41OC4xNi4xNS4zOS4yMy42LjJsMS43Ni0uMTZjLjU1LS4wNS45Ni0uNTMuOTMtMS4wOC0uMi0zLjE3LS4yNC00LjMtLjI0LTQuNjksMC0uODUtLjMyLTguMTktLjQ1LTEwLjk4WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDY5LjkxLDUzLjE1bC0xLjg3LjNjLS4zNy4wNi0uNjcuMzMtLjc1LjctLjU4LDIuNTQtMi4zNyw3LjI5LTMuNjksMTAuMTQtMS4zNywyLjk3LTUuNjMsNy4xMS05LjA3LDcuOTktMy4zMi44NS0xNC43NywxLjUzLTE5LjQuNzItMi45Ni0uNTItNC41NS0yLjQ4LTQuNzMtNS44Mi0uMDgtMS40OS0uNjgtMTkuNjctLjY4LTI0LjE0LDAtMS43OC4wNC00LjQ0LjA3LTcuMjkuMDYtNC4zLjEyLTkuMTguMDgtMTEuOTctLjAxLS43OC0uMDYtMS42OC0uMTItMi42NC0uMjgtNS4wNy0uNjUtMTIsMy41MS0xMy4xNCwzLjk0LTEuMDgsNy44OC0uODcsOC45OS0uNzguNC4wMi43OS0uMTUsMS4wMy0uNDguMjQtLjMzLjI4LS43Ni4xMi0xLjE0bC0uNTgtMS4zM2MtLjI4LS42My0uOS0xLjA1LTEuNTktMS4wNi0xLjg0LS4wMy0xMS4yOC0uMTgtMTYuMTYuMS00LjY3LjI3LTE0LjMyLS4wMy0xNy4xNy0uMTMtLjczLS4wNS0xLjM2LjUzLTEuNDIsMS4yNmwtLjIsMi40OGMtLjAyLjI4LjA4LjU1LjI4Ljc1cy40Ny4yOC43NS4yOGMxLjMtLjEsNS43MS0uNCw3LjYyLjA0LDEuOTQuNDUsMy4xMiwxLjg4LDMuOTYsNC43OS40NSwxLjU3LjE1LDkuOTctLjA3LDE2LjEtLjEzLDMuNTItLjI0LDYuNTctLjIxLDguMDMuMDgsNC4zMy0uMDIsMjUuNTItLjEsMjguNTh2LjQ2Yy0uMDgsMi44OS0uMTQsNS4zOS0yLjY2LDYuNTgtMS43NC44Mi00LjQ4Ljc5LTYuMjkuNTMtLjMyLS4wNS0uNjguMDUtLjk0LjI4LS4yNi4yMy0uNC41NS0uMzkuODlsLjA0LDEuNThjLjAyLjc2LjYzLDEuMzksMS4zOSwxLjQzLDEuNDMuMDcsMy43Ni4xNiw1Ljg1LjE2LjgsMCwxLjU3LS4wMSwyLjI0LS4wNSwxLjI2LS4wNiw0LjQ0LS4wNSw4LjQ4LS4wNCw2LjM3LjAyLDE1LjEuMDUsMjEuNjQtLjIsNC43OC0uMTgsOS44Mi0uMTYsMTMuODYtLjE0LDMuNTcuMDEsNi40LjAzLDcuNzUtLjEuNjgtLjA2LDEuMTgtLjYzLDEuMTgtMS4zMS0uMDItMi4yMy4wMi05LjIuMDktMTAuNzcuMDctMS42NC4zNS04LjE0LjQ1LTEwLjUuMDEtLjM0LS4xMi0uNjYtLjM3LS44OHMtLjU5LS4zMi0uOTItLjI3WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTYwLjY1LDU1LjMzYy0uMDMtLjc0LS42NC0xLjMzLTEuMzgtMS4zNGgtLjc4cy0uMDEsMC0uMDIsMGMtMS4yMiwwLTIuMi45NS0yLjI1LDIuMTctLjA4LDIuMDMtLjYsNS45NC0zLjE2LDkuMzMtMy44NCw1LjA4LTguNDMsNi42OC0xMC44Myw3LjE4LTIuNzEuNTctMTUuNzIsMS45Ny0xOC44My0uMDEtMi42Ni0xLjY5LTIuOTctNy44MS0zLjE1LTExLjQ3LS4wNC0uNzEtLjA3LTEuMzUtLjExLTEuODctLjI2LTMuMTEtLjE5LTE3Ljg2LS4yNS0xOS40NywxLjM4LS4wMyw4LjQ0LS4xMywxMi4xMy40NSwzLjguNiw0LjMsMS42Niw0Ljk4LDMuMTNsLjA5LjJjLjQuODQuNjEsMi45My41Nyw1LjU3LDAsLjUxLjM1Ljk1Ljg1LDEuMDVsMS40LjI4Yy4zOS4wOC43OC0uMDIsMS4wOS0uMjdzLjQ4LS42Mi40Ny0xLjAybC0uMTYtMjMuNTJjMC0uMjktLjEyLS41Ni0uMzMtLjc2LS4yMS0uMi0uNS0uMzItLjc4LS4yOGwtMS45Ni4xMWMtLjIyLjAxLS40NC4xMi0uNTguMjktLjE0LjE3LS4yMS40LS4xOC42My4xMS44NC4yNywzLjEtLjY4LDUuODgtMS4wMywzLjAzLTYuMTEsMy4zMy04LjU1LDMuNDctLjMzLjAyLS42MS4wNC0uODMuMDYtMS41OS4xNC01LjkuMjQtNy42OC4yNC4wMi03LjAxLjA1LTE5LjA4LS4wNC0yMS4xNS0uMDgtMS45NC4wMi01LjMuMDgtNy4xMywwLS4xNy4xNC0uMzEuMzItLjMyLDMuMjgtLjExLDE2Ljc1LjA5LDE2Ljg5LjEsNS43MSwwLDcuMTcsMS42Myw5LjkyLDUuMzMsMi4xOCwyLjkzLDIuNTQsNy4xLDIuNTksOC43Ni4wMi42NS41NCwxLjE2LDEuMTksMS4xNmgxLjQzYy40Mi0uMDIuNzktLjIyLDEuMDYtLjU0cy4zOS0uNzIuMzUtMS4xM2wtMS41OC0xNi4xOWMtLjA4LS44Ni0uOC0xLjUxLTEuNjYtMS41MWgtLjAxYy0yLjg3LjAyLTE3LjM3LjExLTIwLjcuMzItMi4zNi4xNS0xMy41OC4xOS0yMS43Ny4yMy0zLjU1LjAxLTYuNDkuMDItNy44Mi4wNC0uNjUuMDEtMS4xNy41Mi0xLjE5LDEuMTdsLS4wMywxLjEzYy4wNC43OS43MSwxLjM4LDEuNDksMS4zNyw0Ljk4LS4xMiw2LjksMS4zMiw3LjI2LDIuMi4zOC45LjQzLDguODYuNDYsMTMuNjEuMDEsMS41My4wMiwyLjg4LjAzLDMuODQuMDIsMS4zMi4xLDMuODUuMTksNi45OS4yMSw3LjI1LjUsMTcuMTcuNDgsMjMuMTUtLjAzLDcuMjYtLjI0LDEzLjg4LTIuNTEsMTUuMTUtMS44MSwxLjAxLTYuNDEsMS40OS03Ljc4LDEuNjEtLjYuMDUtMS4wNi41Ni0xLjA0LDEuMTdsLjA0LDEuODRjLjAyLjY5LjU3LDEuMjUsMS4yNSwxLjI3LjY5LjAzLDEuNzcuMDYsMy4wOC4wNiwyLjQzLDAsNS42Ny0uMSw4LjgtLjUxLDQuMzctLjU4LDE1Ljk5LS4zOSwyNC40Ny0uMjYsMy4xNy4wNSw1LjkuMDgsNy41NS4wOSw0LjUyLS4wMywxMi41OS0uMDEsMTYuMTgsMGgwYy41OSwwLDEuMTQtLjIzLDEuNTYtLjY1LjQyLS40Mi42NS0uOTguNjQtMS41Ny0uMDItMy4yNC0uMDQtOC45My4wMS0xMC41NC4wNi0xLjc4LS4xNS02Ljk1LS4yNC05LjA5WiIvPgogIDwvZz4KICA8Zz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTc3NS4wOCw0LjIxYy00LjUxLjA1LTUuNi4wNS01LjYuMDVoLS40NGwuMTgsMy45My40OS0uMTJzMi43NS0uNjYsNS4xMS4yOGMyLjIxLjg4LDMuMDEsMi4xOSwyLjIzLDguMDQtLjYsNC40Ny0yLjc0LDExLjg2LTQuMTUsMTYuNzYtLjQxLDEuNDItLjc2LDIuNjQtMSwzLjUyLTEuMDIsMy44LTUuNzgsMTkuNzctNy4zMiwyNC41Ny0uOTItMi4wNi0zLjA2LTYuOTMtNC4xNC0xMC4wMi0uMzktMS4xMS0xLjA2LTIuOTgtMS44Ni01LjItMi4xNC01Ljk3LTUuMDctMTQuMTQtNi4xNS0xNy42OS0xLjUtNC45My04LjA0LTIyLjc0LTguNTItMjMuODlsLS4xLS4yNS0zLjc4LS4yLS4wOS4zMWMtLjA0LjEzLTQsMTMuMzQtNy4yMywyMi44OC0xLjk0LDUuNzMtNS4zMiwxNi45MS03Ljc0LDI1LjA4LTEuMjgsNC4yMy0yLjM1LDcuOC0yLjkzLDkuNjItMS4yOC00LjI4LTUuNS0xOC4zMi03Ljg5LTI0Ljc2LTEuNzItNC42Mi0zLjc0LTExLjYyLTYuMDItMjAuODFsLS4xOC0uNzNjLS40MS0xLjYzLTEuMDQtNC4wOS0uNjgtNS42LjMzLTEuMzksMi43LTIuMDUsNy4wOS0xLjk0aC40N3MtLjA0LS40NS0uMDQtLjQ1Yy0uMzEtMy40MS0uMzYtMy40NC0uNTctMy41OGwtLjE3LS4xMS0uMTMuMDVjLTEuMTEuMDMtMTguNjYuMTUtMjcuOTYuMjFoLS40M3MuMTMsNC4yLjEzLDQuMmwuNDctLjA4czQuOTgtLjc5LDcuNjgsMi43NWMxLjgzLDIuNCw0LjgxLDkuMzUsNi43MiwxNy40OSwxLjI3LDUuNDMsNS42MiwxOS4yNyw5LjEyLDMwLjM5LDEuODMsNS44NCwzLjQxLDEwLjg3LDQuMDEsMTMsMS42LDUuNjksMi4xLDYuNTgsMi4yMSw2LjcxbC4xMS4xMywzLjE0LjMuMTEtLjMxYy4xLS4yOSw5LjgxLTI4LjcyLDEwLjg3LTMxLjcyLjkyLTIuNjMsNi41My0yMC43Myw3Ljk5LTI1LjQ3LDEuODUsNC43LDkuMDYsMjMuMTIsMTAuNiwyOC42MiwxLjc4LDYuMzYsOS4zOSwyNS45NSwxMC43NiwyOC44NmwuMTIuMjYsMy43My0uMjYuMDgtLjI4Yy4xLS4zNCw5LjczLTM0LjIxLDExLjk3LTQxLjQ5LDIuNDktOC4xMSw2Ljk3LTIyLjQzLDgtMjQuNjgsMS4xOC0yLjU4LDMuMzUtMy44Niw0LjUzLTQuNCwxLjYyLS43MywzLjM3LS43OSwzLjM5LS44aC4zNnMuMzctMy4zNi4zNy0zLjM2aC0uNDdzLTExLjg3LjA5LTE2LjM5LjE0WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNOTk4LjQ1LDc1LjE1Yy0uMTYtLjExLS4zNy0uMTYtLjU3LS4xMS0xLC4yMi00LjYyLjcxLTguOTYtMi4zLTUuOTYtNC4xNS0xMC44My04Ljc2LTEzLjAzLTEyLjM2LTIuNTUtNC4xNi04LjQ0LTExLjgzLTEwLjE3LTEzLjU5LS41My0uNTQtMS4yMS0xLjI4LTEuOTMtMi4wNi0xLjQ1LTEuNTgtMi41NS0yLjc1LTMuMjktMy40MiwxLjM2LS4yOCwzLjktLjgzLDUuMzctMS4yOCwyLjQzLS43NCw1LjgtMi4zMSw4LjEyLTUuNTYsMi40LTMuMzYsNC4wOS03LjA5LDQuNTItOS45NS40LTIuNjQuNTEtNi41Ni0uNDktOC45Mi0uNi0xLjQyLTIuOS02LjMzLTcuMTYtOS41Ny0zLjk1LTMtMTAuNTMtMy45MS0xNi4zOS00LjUzLTUuOTMtLjYzLTIwLjIxLjUzLTIzLjcxLjg3LTIuNTIuMjUtOS44Ni4zMS0xMC42OS4zMS0uMzgsMC0uNjguMy0uNy42MmwtLjQ3LDIuNTZjMCwuMTkuMDYuMzkuMi41My4xMy4xNC4zMi4yMi41MS4yMmguMDFjMy4wOS0uMDcsNS4yMS0uMDIsNS44My4xNGwxLjExLjI4Yy4xMS4wNCwyLjYuOTYsMy4wMiw0LjM0LjQzLDMuNS40OSwxMS43Ny41MywxNy4yNHYuODVjLjAzLDMuMTEtLjE2LDguODktLjM1LDE0LjQ5LS4xNCw0LjIyLS4yOSw4LjU5LS4zMywxMS42NS0uMDIsMS40MiwwLDIuOTMuMDIsNC40Ny4wNyw1Ljc5LjE1LDEyLjM1LTIuMDUsMTMuNzYtMi40MiwxLjU1LTcuMDgsMS4zNi04LjQ1LDEuMjYtLjIyLS4wMi0uNDQuMDYtLjU5LjIxLS4xNi4xNS0uMjUuMzYtLjI1LjYzbC4yNCwxLjk2YzAsLjQ0LjM2Ljc5Ljc5Ljc5aDM0Ljg1Yy40OSwwLC44OC0uNC44OC0uODh2LTEuNzFjMC0uMjUtLjExLS40OS0uMy0uNjYtLjE5LS4xNy0uNDQtLjIzLS42OS0uMjItMS4zNC4xNy00LjguNDYtOC4wMy0uMzEtMy45MS0uOTQtMy45Ni03LjY5LTMuOTgtMTAuNTgtLjAzLTMuMTUtLjAzLTIxLjExLS4wMy0yMS4yOWwuMDgtLjA4YzEuMDEuMDMsNC40MS4xMiw1LjY3LjM2LDEuMzguMjYsNC4xNywyLjcxLDYuNDksNS43MSwyLjMsMi45OCw5Ljc3LDEyLjksMTIuNDgsMTYuNzYuMzcuNTMuNzgsMS4xMywxLjIyLDEuNzgsMi45NSw0LjMxLDYuOTksMTAuMjIsMTAuMzMsMTEuMjMsMS4yOC4zOSw0LjA2LjUyLDcuMTguNTIsNS4yLDAsMTEuMzQtLjM2LDEzLjA4LS40Ny4yLS4wMS4zOS0uMTEuNTEtLjI3cy4xOC0uMzYuMTUtLjU1bC0uMzMtMi4zNGMtLjAzLS4yLS4xNC0uMzctLjMtLjQ5Wk05NDEuNzYsMjQuMTFjLS4wOC0zLjU5LjA5LTE2LjQ5LjEyLTE4LjY1LDIuNzMtLjcyLDguOTMtLjIzLDExLjUzLjAyLDQuMzcuNDIsOC4yNCwyLjUsMTAuOSw1Ljg0LDMuMTYsMy45NiwzLjU0LDkuNiwyLjkxLDEzLjIzLS43NSw0LjMxLTMuNjMsMTAuMDQtOS4yOSwxMS45OS01LjIzLDEuOC0xNC4xMSwxLjk2LTE2LjEzLDEuOTcsMC0yLjAzLjAzLTEwLjkzLS4wNC0xNC40WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTExMC4xNiw3NC44Yy0xLjA3LjA1LTQuNzcuMTItNy43My0xLjYyLTMuNTYtMi4wOS0xMC44Ny05LjYtMTUuMjQtMTQuMDhsLS4zLS4zMWMtMS4xNy0xLjItMi41NC0yLjY0LTQuMDEtNC4xOC00LjEyLTQuMzItOS4yNC05LjY5LTEyLjYzLTEyLjY3LTMuODMtMy4zNi03LjA3LTYuMzgtNy45Ny03LjIxLjM1LS4zNCw4LjY2LTguMjcsMTIuMjctMTEuODEsMS4wMi0xLDIuMTgtMi4yLDMuNDEtMy40OCwzLjI5LTMuNDIsNy4wMi03LjI5LDkuOS05LjEzLDQuMDctMi42LDYuNzQtMy41OSw5Ljg3LTMuNjYuMzksMCwuNzEtLjI4Ljc5LS42NWwuNC0xLjkxYy4wNS0uMjMsMC0uNDctLjE1LS42Ni0uMTQtLjE5LS4zNi0uMzEtLjYtLjMyLTEuMTctLjA4LTQuNTgtLjI1LTEwLjkxLS4xNy02LjkuMS0xMy44OS0uMDMtMTUuODYtLjA3LS40NCwwLS44LjMzLS44NC43NmwtLjE0LDEuODNjLS4wMy40My4yOC44MS43Ljg4LjY1LjA5LDIsLjM0LDMuNjcuOTMsMS4yMy40NCwzLjUyLDEuMjUsMy45MywyLjI5LjExLjI3LjA4LjU0LS4wOC44Ni0uMS4xOS0uMTkuMzctLjI4LjU2LS43OCwxLjYtMS41OSwzLjI1LTYuODYsOC41OS0yLjk1LDIuOTktNS41NCw1LjUyLTcuODIsNy43Ni0yLjI4LDIuMjItNC4wNywzLjk4LTUuMzYsNS4zNS0yLjExLDIuMjQtNy41Miw2LjU2LTkuMTEsNy44My0uMjItMTAuMDEtLjMxLTE2LjY0LS4yNi0xOC42OC4wMS0uNjQuMDEtMS40MiwwLTIuMjgtLjAyLTMuNDgtLjA0LTkuMzEsMS40Ni0xMC4zNywxLjc5LTEuMjYsOC40OC0yLDkuMy0yLjA1aC4ycy4xMi0uMTUuMTItLjE1Yy4xNi0uMTkuMTgtLjIyLS40NS0zLjI3LS4wOC0uMzgtLjQyLS42Ni0uOC0uNjYtMS45MSwwLTExLjc2LS4wMy0xOC41LjA0LTYuMzQuMDctMTIsLjExLTEzLjU2LjEyLS4yMiwwLS40My4wOS0uNTkuMjYtLjE1LjE2LS4yMy4zNy0uMjMuNmwuMDksMi4yOWMwLC4yMy4xMS40NS4yOS41OS4xOC4xNS40LjIxLjYzLjE5LDEuMDQtLjEzLDQuNjEtLjM5LDYuOTQsMS41MywyLjksMi4zOSwzLjA3LDEwLjkxLDMuMTcsMTYuNTUuMDYsMi45MS4wNyw4LjA0LjA4LDEzLjQ4LjAyLDYuNDEuMDMsMTMuMDMuMTIsMTcuMTZsLjA2LDIuODFjLjEzLDUuNjkuMTksOC4yOC0uMjYsMTEuNjItLjQ4LDMuNTktNC40NCw1LjE3LTYuODIsNS4zMy0xLjc1LjEyLTMuMzgsMC00LjItLjA3LS4yMy0uMDQtLjQ3LjA2LS42NC4yMi0uMTcuMTYtLjI2LjM5LS4yNS42M2wuMDgsMS45M2MuMDIuNDQuMzguNzkuODIuNzkuMDEsMCwuMDIsMCwuMDMsMCwxLjkxLS4wOCwxMS41OC0uNDcsMTQuNDUtLjU0LDIuNTItLjA4LDExLjQxLjE5LDE2LjcyLjM1bDIuNzcuMDhjLjQ0LjA1Ljc3LS4yOC44My0uNjlsLjMxLTEuOWMuMDQtLjIzLS4wMi0uNDYtLjE2LS42NC0uMTQtLjE4LS4zNS0uMjktLjU4LS4zMS0uOTEtLjA3LTMuMjgtLjI0LTUuNi0uMjQtMi43OSwwLTQuNDgtMS40NS01LjA0LTQuMzEtLjQtMi4wOC0uNTQtOS42MS0uNjMtMTQuNi0uMDQtMi40My0uMDgtNC4zNS0uMTMtNS4xNC0uMTMtMi4wMS0uMDItNC4zNS4wMy01LjI2bDUuMTktNC4zNGMxLjI5LDEuMiw3Ljg0LDcuMzEsMTAuNCwxMC4xOCwxLjY4LDEuOTEsNS45LDYuMTMsOS42Miw5Ljg2LDIuNjYsMi42Niw1LjE4LDUuMTgsNi41NCw2LjYyLDIuMjcsMi40LDIuMjMsNCwyLjExLDQuNTctLjEuNDctLjM0Ljc3LS41My44NS0uNzkuMzQtMi42Ny43My0zLjkzLjg5LTEuMDYuMTMtNC45NS4yNy02LjEyLjMtLjIyLDAtLjQzLjEtLjU4LjI2LS4xNS4xNy0uMjMuMzgtLjIyLjYuMTYsMywuMjMsMy4wNS40MywzLjE5bC4xMS4xMy4xOS0uMDZjLjQ3LS4wNiwxMS4yMi0uNiwxNS42MS0uNjgsNC40OS0uMDksMTcuOTItLjA0LDIyLjQ1LjA3LjI0LjAyLjQ1LS4wOS42MS0uMjUuMTYtLjE2LjI0LS4zOS4yMy0uNjJsLS4xMS0xLjk1Yy0uMDMtLjQ1LS40NC0uODItLjg3LS43N1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTExODEuMTksNDEuODhjLTMuMzMtMy4xNC01LjU2LTQuMDEtMTAuNDUtNS45Mi0uODgtLjM0LTEuODUtLjcyLTIuOTItMS4xNS04Ljc4LTMuNTEtMTQuMjUtNi40OS0xNi43LTkuMDktMi43Ni0yLjkzLTQuMy02LjA5LTQuNDQtOS4xNS0uMTQtMy4yMSwxLjAyLTYuNDMsMy4xMy04LjYxLDIuNC0yLjQ5LDcuNjYtMy4xMiwxMy4xLTEuNTYsNS43OCwxLjY2LDguNTIsNS4wNywxMS4yNiw5LjAzLDIuMDksMy4wMiwyLjc3LDUuOTIsMi45Niw3LjAyLjA5LjUxLjU2Ljg0LDEuMDUuODJsMS45NC0uMTRjLjUyLS4wNC45Mi0uNDguOTItMXYtLjU2Yy0uMDItMS44LS4wNC01LjM0LS4wNC02LjkxLDAtMS43NC4wNi03LjcxLjA4LTkuOTl2LS4yM2MwLS4yOS0uMTItLjU3LS4zMy0uNzYtLjIxLS4yLS41LS4yOS0uNzktLjI2bC0yLjM4LjI0Yy0uNTIuMDUtLjkyLjQ5LS45MiwxLjAxLDAsLjg3LS4wNywyLjk5LS43OSwzLjk5LS4zLjQyLS41My41LS43LjUyLS44NC4xNC0yLjM2LS45Ni01LjI4LTMuMjYtNC41Ni0zLjYtMTAuNjQtNC41NS0xNy41Ny0yLjczLTcuNDYsMS45NS0xMi4wMiw4LjU4LTEzLjEsMTMuOTItLjk3LDQuOC0uMzcsMTQuMzksOC4wMiwxOS44NSw1LjM4LDMuNSwxMC4wNyw1Ljg2LDE1LjA0LDguMzYsMi4xNywxLjA5LDQuNDEsMi4yMiw2Ljc1LDMuNDcsNy42LDQuMDUsOC4xOSw1LjMsMTAuNDEsOS45OSwyLjA1LDQuMzQtLjE1LDguMjUtMi44NCwxMS44My0yLjI3LDMuMDItNi40LDYuODgtMTUuODcsNS41Ni05LTEuMjUtMTEuNjUtNS4yOS0xNC4yMS05LjE5bC0uNDEtLjYzYy0yLjIzLTMuMzYtMy44OC0xMC45NC00LjM0LTEzLjE5LS4xMS0uNTItLjYtLjg3LTEuMTMtLjc3bC0xLjk0LjMzYy0uNDUuMDgtLjc5LjQ1LS44Mi45MS0uMDksMS41NS0uMzYsNi45MS0uMDEsMTAuNzQuMzMsMy42OS4yLDEwLjIuMTUsMTIuMTEsMCwuMzQuMTMuNjYuMzcuOS4yNC4yMy41Ny4zNi45MS4zNGwyLjE1LS4xM2MuNi0uMDQsMS4wOC0uNSwxLjEzLTEuMS4wNC0uNDQuMS0xLjAzLjE3LTEuNTUuMDYtLjQ0LjctMS43MywxLjcxLTMuNDQuMDYtLjA5LjE1LS4xMS4xOC0uMTEuMDQsMCwuMTMsMCwuMi4wOS43NC45NCwyLjE1LDIuNjgsMy4zNSwzLjcyLDEuNjMsMS40MSw2Ljc3LDQuMjIsMTEuODYsNC42NSwxLjI1LjEsMi42LjE3LDQsLjE3LDUuMTEsMCwxMC45Mi0uOTEsMTQuOTktNC4yMyw1LjE0LTQuMiw5LjA1LTExLjM2LDkuMy0xNy4wMi4yMi01LjE4LTMuMTItMTMuMDUtNy4xNi0xNi44NVoiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTg3Ni4wOCw5LjE2Yy05LjQ1LTcuNjUtMjcuMDUtNy42NC0yNy43My03LjY2LS4xNi0uMDItMTQuMjYtLjM5LTI2LjYsMTEuOTUtMTMuMjUsMTMuMjUtMTAuNjIsMzIuMTEtOC40OSwzOC4yNSwyLjkyLDguNDEsMTAuNjcsMjMsMjkuNzksMjYuMjQsMi41OS40NCw1LjU5LjY1LDguNjIuNjUsNC43NCwwLDkuNTItLjUyLDEyLjgtMS40OSw1LjY5LTEuNjksOS44My00LjczLDE1LjQ3LTkuNzYsOS43Ny04LjcxLDEyLjA1LTI1LjA3LDEwLjUxLTMzLjM4LTEuMjMtNi42NS00LjA2LTE2LjQ3LTE0LjM4LTI0LjgxWk04NzUuNzIsNTcuODljLTIuODgsNi41My05LjksMTQuODgtMjAuMjQsMTYuOTUtMTAuMTQsMi4wMy0xNi4xNC0yLjU5LTIxLjktNy45Mi01Ljc2LTUuMzMtOS4yMy0xMi4wNi05Ljc4LTE4Ljk1LS41My02LjY3LTEtMjMuMjYsNi4xNi0zMy4yMSw3LjA3LTkuODQsMTkuODUtMTAuMTcsMTkuOTctMTAuMTcsNy41My4wMiwxMy45MSwyLjQ0LDE5LjUxLDcuMzksNS4zOSw0Ljc2LDYuNTIsMTAuOTUsNy41MSwxNi40LjE4Ljk3LjM1LDEuOTEuNTQsMi44MiwxLjI4LDYuMTIsMS4yMywxOS44OC0xLjc4LDI2LjdaIi8+CiAgPC9nPgogIDxnPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjE4LjMzLDQwLjQ1cy4wNS0zLjcyLDEuMzYtNi4yOWMxLjMtMi41Nyw0LjEtNC41Niw1LjYtNC45MiwxLjUtLjM2LDQuNS0xLjI3LDcuNjktLjc1LDMuMTkuNTIsNS4zNywxLjUsNy4zOSwzLjQ1LDIuMDIsMS45NSwyLjc3LDUuNywyLjk2LDcsLjIsMS4zLS4zMyw1LjM0LTIuMTIsNy42Ni0xLjc5LDIuMzEtMi4wNSwzLjYyLTYuOTEsNS41Ny00Ljg1LDEuOTUtOS4yNS0uMjYtMTAuMzktMS4yMS0xLjE0LS45NC0zLjAzLTEuOTktNC4xNy00LjA3LTEuMTQtMi4wOC0xLjM0LTQuODUtMS40Mi02LjQ1WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjMwLjI4LDUzLjM4Yy0zLjIzLDAtNS43Ny0xLjM5LTYuNjItMi4wOS0uMjUtLjItLjUzLS40MS0uODMtLjY0LTEuMTEtLjgyLTIuNS0xLjg1LTMuNDMtMy41NS0xLjI2LTIuMy0xLjQxLTUuNDQtMS40Ny02LjYzdi0uMDNjMC0uMTYuMDctMy44NCwxLjQtNi40NywxLjQtMi43Nyw0LjMyLTQuNzYsNS44OC01LjE0bC41Mi0uMTNjMS42NC0uNDEsNC4zOS0xLjEsNy4zMy0uNjMsMy4zNi41NSw1LjU3LDEuNTgsNy42MiwzLjU3LDIuMTcsMi4xLDIuOTEsNi4wNywzLjA5LDcuMjQuMjIsMS40Ni0uMzYsNS41OS0yLjIsNy45Ny0uMjkuMzctLjU0LjcyLS43NywxLjA1LTEuMjQsMS43My0yLjEzLDIuOTctNi4zMSw0LjY1LTEuNDcuNTktMi44OS44Mi00LjIuODJaTTYxOC43NSw0MC40NGMuMDYsMS4xNC4yLDQuMTMsMS4zNyw2LjI1Ljg0LDEuNTQsMi4xNSwyLjUxLDMuMiwzLjI4LjMyLjIzLjYxLjQ1Ljg3LjY3Ljg4LjczLDUuMTcsMy4wOCw5Ljk3LDEuMTQsMy45NS0xLjU5LDQuNzQtMi42OSw1Ljk0LTQuMzcuMjQtLjMzLjUtLjY5Ljc5LTEuMDcsMS43My0yLjI0LDIuMjEtNi4xNiwyLjA0LTcuMzQtLjEyLS43OC0uODEtNC44LTIuODQtNi43Ny0xLjkxLTEuODUtMy45OS0yLjgyLTcuMTctMy4zNC0yLjc3LS40Ni01LjQyLjIxLTYuOTkuNjFsLS41My4xM2MtMS40LjMzLTQuMTEsMi4yOS01LjMzLDQuNy0xLjIxLDIuMzgtMS4zMSw1Ljg2LTEuMzEsNi4xWiIvPgogIDwvZz4KPC9zdmc+`;

export type ContactEmailFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function contactEmailHtml(fields: ContactEmailFields) {
  const { name, email, phone, subject, message } = fields;

  const detailRow = (label: string, value: string, href?: string) => {
    if (!value) return "";
    const display = href
      ? `<a href="${href}" style="color:#4f6b4a;text-decoration:none;">${value}</a>`
      : `<span style="color:#141414;">${value}</span>`;
    return `
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:100px;">
          <span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;">${label}</span>
        </td>
        <td style="padding:10px 0;vertical-align:top;">
          <span style="font-size:15px;line-height:1.5;">${display}</span>
        </td>
      </tr>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f1ea;font-family:Georgia,'Times New Roman',serif;">

<!-- Outer wrapper -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ea;padding:40px 20px;">
<tr><td align="center">

<!-- Card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:2px;">

  <!-- Header band -->
  <tr>
    <td style="background-color:#2f3e2c;padding:32px 40px 28px;">
      <img src="${LOGO_SRC}" alt="Gentle Works" width="180" height="12" style="display:block;margin:0 0 20px;width:180px;height:auto;" />
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(245,241,234,0.5);">New Inquiry</p>
      <h1 style="margin:0;font-size:26px;font-weight:400;font-style:italic;color:#f5f1ea;line-height:1.3;">${name}</h1>
    </td>
  </tr>

  <!-- Thin accent line -->
  <tr><td style="height:3px;background-color:#4f6b4a;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Subject callout (if provided) -->
  ${subject ? `
  <tr>
    <td style="padding:28px 40px 0;">
      <p style="margin:0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;">Regarding</p>
      <p style="margin:6px 0 0;font-size:20px;font-weight:400;font-style:italic;color:#141414;line-height:1.4;">${subject}</p>
    </td>
  </tr>` : ""}

  <!-- Message -->
  <tr>
    <td style="padding:${subject ? "24px" : "32px"} 40px 0;">
      ${message
        ? `<p style="margin:0;font-size:15px;line-height:1.7;color:#141414;white-space:pre-wrap;">${message}</p>`
        : `<p style="margin:0;font-size:15px;line-height:1.7;color:#6b6b6b;font-style:italic;">No message provided.</p>`}
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding:28px 40px 0;"><hr style="border:none;border-top:1px solid #e5dfd3;margin:0;"></td></tr>

  <!-- Contact details table -->
  <tr>
    <td style="padding:20px 40px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Georgia,'Times New Roman',serif;">
        ${detailRow("Name", name)}
        ${detailRow("Email", email, `mailto:${email}`)}
        ${detailRow("Phone", phone, `tel:${phone}`)}
      </table>
    </td>
  </tr>

  <!-- Reply prompt -->
  <tr>
    <td style="padding:0 40px 36px;">
      <a href="mailto:${email}" style="display:inline-block;padding:12px 32px;background-color:#2f3e2c;color:#f5f1ea;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:30px;">Reply to ${name.split(" ")[0]}</a>
    </td>
  </tr>

</table>
<!-- /Card -->

<!-- Footer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr>
    <td style="padding:24px 40px 0;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:0.08em;color:#6b6b6b;">GENTLE WORKS</p>
      <p style="margin:6px 0 0;font-size:11px;color:#6b6b6b;">Architecture &amp; Design Studio &middot; Atlanta, Georgia</p>
    </td>
  </tr>
</table>

</td></tr>
</table>
<!-- /Outer wrapper -->

</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Confirmation email sent back to the person who reached out         */
/* ------------------------------------------------------------------ */

export function confirmationEmailHtml(fields: { firstName: string; subject: string }) {
  const { firstName, subject } = fields;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f1ea;font-family:Georgia,'Times New Roman',serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ea;padding:40px 20px;">
<tr><td align="center">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:2px;">

  <!-- Header band -->
  <tr>
    <td style="background-color:#2f3e2c;padding:32px 40px 28px;">
      <img src="${LOGO_SRC}" alt="Gentle Works" width="180" height="12" style="display:block;margin:0 0 20px;width:180px;height:auto;" />
      <h1 style="margin:0;font-size:26px;font-weight:400;font-style:italic;color:#f5f1ea;line-height:1.3;">Thank you, ${firstName}.</h1>
    </td>
  </tr>

  <!-- Accent line -->
  <tr><td style="height:3px;background-color:#4f6b4a;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Body -->
  <tr>
    <td style="padding:32px 40px 0;">
      <p style="margin:0;font-size:15px;line-height:1.7;color:#141414;">We received your message${subject ? ` regarding <em>${subject}</em>` : ""} and appreciate you reaching out.</p>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#141414;">A member of our team will review your inquiry and get back to you shortly. We typically respond within one to two business days.</p>
      <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:#141414;">In the meantime, feel free to explore our recent work at <a href="https://gentle.works/projects" style="color:#4f6b4a;text-decoration:none;">gentle.works</a>.</p>
    </td>
  </tr>

  <!-- Sign-off -->
  <tr>
    <td style="padding:28px 40px 0;">
      <p style="margin:0;font-size:15px;line-height:1.7;color:#141414;">Warmly,</p>
      <p style="margin:4px 0 0;font-size:15px;font-style:italic;color:#141414;">The Gentle Works Team</p>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td style="padding:28px 40px 0;"><hr style="border:none;border-top:1px solid #e5dfd3;margin:0;"></td></tr>

  <!-- Contact info -->
  <tr>
    <td style="padding:20px 40px 36px;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#6b6b6b;">
        <a href="https://gentle.works" style="color:#4f6b4a;text-decoration:none;">gentle.works</a><br>
        Atlanta, Georgia
      </p>
    </td>
  </tr>

</table>

<!-- Footer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
  <tr>
    <td style="padding:24px 40px 0;text-align:center;">
      <p style="margin:0;font-size:11px;color:#6b6b6b;">You received this email because you submitted an inquiry through our website.</p>
    </td>
  </tr>
</table>

</td></tr>
</table>

</body>
</html>`;
}
