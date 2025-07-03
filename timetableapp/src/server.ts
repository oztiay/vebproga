import db from "./database";
import { RunResult } from "sqlite3";
import { renderPage } from "./client";

const sendJson = (status: number, data: any): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

Bun.serve({
  port: 3000,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (path === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    if (path === "/" && method === "GET") {
      return new Response(renderPage(), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    if (/^\/api\/schedule\/\d+$/.test(path) && method === "GET") {
      const id = path.split("/")[3];
      
      return new Promise((resolve) => {
        db.get("SELECT * FROM schedule WHERE id = ?", [id], (err, row) => {
          if (err) {
            resolve(sendJson(500, { error: err.message }));
          } else if (!row) {
            resolve(sendJson(404, { error: "Schedule not found" }));
          } else {
            resolve(sendJson(200, row));
          }
        });
      });
    }

    if (path === "/api/schedule" && method === "GET") {
      return new Promise((resolve) => {
        db.all("SELECT * FROM schedule ORDER BY date, time", [], (err, rows) => {
          if (err) {
            resolve(sendJson(500, { error: err.message }));
          } else {
            resolve(sendJson(200, rows));
          }
        });
      });
    }

    if (path === "/api/schedule/by-date" && method === "GET") {
      const date = url.searchParams.get("date");
      if (!date) {
        return sendJson(400, { error: "Date parameter is required" });
      }

      return new Promise((resolve) => {
        db.all("SELECT * FROM schedule WHERE date = ? ORDER BY time", [date], (err, rows) => {
          if (err) {
            resolve(sendJson(500, { error: err.message }));
          } else {
            resolve(sendJson(200, rows));
          }
        });
      });
    }

    if (path === "/api/schedule" && method === "POST") {
      const body = await req.json();
      const { title, classroom, teacher, date, time } = body;


      if (!title || !classroom || !teacher || !date || !time) {
        return sendJson(400, { error: "Missing required fields" });
      }

      return new Promise((resolve) => {
        db.run(
          "INSERT INTO schedule (title, classroom, teacher, date, time) VALUES (?, ?, ?, ?, ?)",
          [title, classroom, teacher, date, time],
          function (this: RunResult, err: Error | null) {
            if (err) {
              resolve(sendJson(500, { error: err.message }));
            } else {
              resolve(sendJson(201, { id: this.lastID }));
            }
          }
        );
      });
    }

    if (/^\/api\/schedule\/\d+$/.test(path) && method === "PUT") {
      const id = path.split("/")[3];
      const body = await req.json();
      const { title, classroom, teacher, date, time } = body;


      if (!title || !classroom || !teacher || !date || !time) {
        return sendJson(400, { error: "Missing required fields" });
      }


      return new Promise((resolve) => {
        db.run(
          "UPDATE schedule SET title = ?, classroom = ?, teacher = ?, date = ?, time = ? WHERE id = ?",
          [title, classroom, teacher, date, time, id],
          function (this: RunResult, err: Error | null) {
            if (err) {
              resolve(sendJson(500, { error: err.message }));
            } else if (this.changes === 0) {
              resolve(sendJson(404, { error: "Schedule not found" }));
            } else {
              resolve(sendJson(200, { message: "Schedule updated" }));
            }
          }
        );
      });
    }

    if (/^\/api\/schedule\/\d+$/.test(path) && method === "DELETE") {
      const id = path.split("/")[3];
      return new Promise((resolve) => {
        db.run("DELETE FROM schedule WHERE id = ?", [id], function (this: RunResult, err: Error | null) {
          if (err) {
            resolve(sendJson(500, { error: err.message }));
          } else if (this.changes === 0) {
            resolve(sendJson(404, { error: "Schedule not found" }));
          } else {
            resolve(sendJson(200, { message: "Schedule deleted" }));
          }
        });
      });
    }

    return sendJson(404, { error: "Not Found" });
  },
});