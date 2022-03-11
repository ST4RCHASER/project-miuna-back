import express from 'express'
const router = express.Router()
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
import excelJS from 'exceljs'
import fs from 'fs';
router.get('/:id', async (_, res) => {
    try {
        let req: MinuRequest = _ as any;
        let event: Event = await getEventByID(req.db, req.params.id);
        if (!event) {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 404,
                message: 'event not found',
            }
            return res.status(404).send(response);
        }
        if (event.state == EventState.DELETED) {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 403,
                message: 'event not found',
            }
            return res.status(403).send(response);
        }
        let history: any[] = [];
        let historyResult = await req.db.getModel(ModelType.EVENT_RECORDS).find({ eventID: event.id });
        if (historyResult) {
            for (const his of historyResult) {
                let user = await req.db.getModel(ModelType.USERS).findById(his.ownerID);
                if (user) {
                    user = {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        student_id: user.student_id,
                        major: user.major,
                        sec: user.sec,
                        created: user.created,
                        lowerUsername: user.lowerUsername,
                        class: user.class,
                    }
                }
                history.push({
                    id: his.id,
                    ownerid: his.ownerID,
                    eventid: his.eventID,
                    timeJoin: his.timeJoin,
                    timeLeave: his.timeLeave,
                    created: his.created,
                    owner: user,
                });
            }
        }
        //Setup workbook
        const workbook = new excelJS.Workbook();
        workbook.creator = 'starchaser';
        workbook.creator = 'yue';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        //Setup columns
        const worksheet = workbook.addWorksheet('Miuna Export Events ' + new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '-' + new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds());
        worksheet.getColumn('A').width = 5;
        worksheet.getColumn('B').width = 22.30;
        worksheet.getColumn('C').width = 16.85;
        worksheet.getColumn('D').width = 10.20;
        worksheet.getColumn('E').width = 13;
        worksheet.getColumn('F').width = 11.30;
        worksheet.getColumn('G').width = 10.45;
        worksheet.getColumn('H').width = 9.60;
        worksheet.getColumn('I').width = 18.30;


        //Merge useing cell
        worksheet.mergeCells('A7:I7');
        worksheet.mergeCells('A8:I8');
        worksheet.mergeCells('A9:I9');
        worksheet.mergeCells('A11:I11');
        worksheet.mergeCells('A12:I12');
        worksheet.mergeCells('A13:I13');

        let border: any = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        let style: any = {
            font: {
                name: 'Angsana New',
                bold: true,
                size: 14,
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
            },
            border: border,
        }
        worksheet.getCell('A14').border = border;
        worksheet.getCell('B14').border = border;
        worksheet.getCell('C14').border = border;
        worksheet.getCell('D14').border = border;
        worksheet.getCell('E14').border = border;
        worksheet.getCell('F14').border = border;
        worksheet.getCell('G14').border = border;
        worksheet.getCell('H14').border = border;
        worksheet.getCell('I14').border = border;

        worksheet.getCell('A14').style = style;
        worksheet.getCell('B14').style = style;
        worksheet.getCell('C14').style = style;
        worksheet.getCell('D14').style = style;
        worksheet.getCell('E14').style = style;
        worksheet.getCell('F14').style = style;
        worksheet.getCell('G14').style = style;
        worksheet.getCell('H14').style = style;
        worksheet.getCell('I14').style = style;

        //Setup Header
        worksheet.getCell('A14').value = 'ลำดับ';
        worksheet.getCell('B14').value = 'ชื่อนักศึกษา';
        worksheet.getCell('C14').value = 'สาขา';
        worksheet.getCell('D14').value = 'กลุ่มเรียน';
        worksheet.getCell('E14').value = 'รหัสนักศึกษา';
        worksheet.getCell('F14').value = 'วันที่เข้าร่วม';
        worksheet.getCell('G14').value = 'เวลาเริ่มต้น';
        worksheet.getCell('H14').value = 'เวลาสิ้นสุด';
        worksheet.getCell('I14').value = 'หมายเหตุ';

        //Add Data
        worksheet.getCell('A7').value = 'แบบฟอร์มกิจกรรม ปีการศึกษา .......';
        worksheet.getCell('A7').style = {
            font: {
                name: 'Angsana New',
                bold: true,
                size: 16,
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
            }
        }
        worksheet.getCell('A8').value = 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ ศูนย์นนทบุรี';
        worksheet.getCell('A8').style = {
            font: {
                name: 'Angsana New',
                size: 14,
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
            }
        };
        worksheet.getCell('A9').value = 'คณะวิทยาศาสตร์และเทคโนโลยี';
        worksheet.getCell('A9').style = {
            font: {
                name: 'Angsana New',
                size: 14,
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
            }
        };
        worksheet.getCell('A11').value = 'ชื่อกิจกรรม...........';
        worksheet.getCell('A11').style = {
            font: {
                name: 'Angsana New',
                size: 14,
                bold: true
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle',
            }
        };
        let current_row = 15;
        for (const p of history) {
            let cellstyle: any = {
                font: {
                    name: 'Angsana New',
                    size: 14,
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'middle',
                },
                border: border
            };
            worksheet.getCell('A' + current_row).style = cellstyle;
            worksheet.getCell('B' + current_row).style = cellstyle;
            worksheet.getCell('C' + current_row).style = cellstyle;
            worksheet.getCell('D' + current_row).style = cellstyle;
            worksheet.getCell('E' + current_row).style = cellstyle;
            worksheet.getCell('F' + current_row).style = cellstyle;
            worksheet.getCell('G' + current_row).style = cellstyle;
            worksheet.getCell('H' + current_row).style = cellstyle;
            worksheet.getCell('I' + current_row).style = cellstyle;

            worksheet.getCell('A' + current_row).value = current_row - 14;
            worksheet.getCell('B' + current_row).value = p.owner.name;
            worksheet.getCell('C' + current_row).value = p.owner.major;
            worksheet.getCell('D' + current_row).value = p.owner.sec;
            worksheet.getCell('E' + current_row).value = p.owner.student_id;
            worksheet.getCell('F' + current_row).value = new Date(p.timeJoin).getDate() +
                '/' +
                (new Date(p.timeJoin).getMonth() + 1) +
                '/' +
                new Date(p.timeJoin).getFullYear();
            worksheet.getCell('G' + current_row).value = new Date(p.timeJoin).getHours() +
                ':' +
                new Date(p.timeJoin).getMinutes() +
                ':' +
                new Date(p.timeJoin).getSeconds();
            worksheet.getCell('H' + current_row).value = new Date(p.timeLeave).getTime() < 1
                ? '-'
                : new Date(p.timeLeave).getHours() +
                ':' +
                new Date(p.timeLeave).getMinutes() +
                ':' +
                new Date(p.timeLeave).getSeconds();
            current_row++;
        }
        const imgID = workbook.addImage({
            buffer: fs.readFileSync('./src/assets/export_logo.png'),
            extension: 'png',
        });
        worksheet.addImage(imgID, {
            tl: { col: 1, row: 0 },
            br: { col: 8.9, row: 6 },
            editAs: 'absolute'
        } as any);
        let filename = 'EXPORT_EVENTS_' + new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '-' + new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds() + '.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + filename);
        await workbook.xlsx.write(res);
        res.end();
        return;
        //send event infomation
        const response: RESTResp<object> = {
            success: true,
            statusCode: 200,
            message: 'event found',
            content: {
                id: event.id,
                name: event.name,
                ownerID: event.ownerID,
                time: {
                    created: event.time.created,
                    start: event.time.start,
                    readable_start: new Date(event.time.start).toLocaleString(),
                    end: event.time.end,
                    readable_end: new Date(event.time.end).toLocaleString(),
                },
                form: event.form,
                options: event.options,
                state: event.state,
                raw: event,
                description: event.description,
                participants: history,
            }
        }
        return res.status(200).send(response);
    } catch (e) {
        console.log(e);
        return res.status(500).send(
            {
                success: false,
                statusCode: 500,
                message: 'internal server error',
            }
        );
    }
});
export default router