import express from 'express'
const router = express.Router()
import fs from 'fs';
import { RESTResp, requireAuth, Event, findUserEventRecordByEventID, MinuRequest, getEventByID, EventState, getEventRecordByID, leaveUserFromEvent, joinUserToEvent, ModelType } from '@project-miuna/utils'
import excelJS from 'exceljs'
router.get('/:id', async (_, res) => {
    try {
        let req: MinuRequest = _ as any;
        let userResult: any = await req.db.getModel(ModelType.EVENT_RECORDS).find({ ownerID: req.params.id });
        let userData = await req.db.getModel(ModelType.USERS).findById(req.params.id);
        let eventList: any[] = [];
        if (userResult) {
            for (const event of userResult) {
                let eventInfo = await getEventByID(req.db, event.eventID);
                if (eventInfo && eventInfo.state != EventState.DELETED) {
                    event.eventInfo = eventInfo;
                    eventList.push({
                        eventID: event.eventID,
                        eventInfo: eventInfo,
                        ownerID: event.ownerID,
                        created: event.created,
                        timeJoin: event.timeJoin,
                        timeLeave: event.timeLeave,
                    });
                }
            }
        }
        if (!userData) {
            const response: RESTResp<never> = {
                success: false,
                statusCode: 404,
                message: 'user not found',
            }
            return res.status(404).send(response);
        }
        //Setup workbook
        const workbook = new excelJS.Workbook();
        workbook.creator = 'starchaser';
        workbook.creator = 'yue';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        //Setup columns
        const worksheet = workbook.addWorksheet('Miuna Export History ' + new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '-' + new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds());
        worksheet.getColumn('A').width = 20;
        worksheet.getColumn('B').width = 20;
        worksheet.getColumn('C').width = 20;
        worksheet.getColumn('D').width = 20;

        worksheet.mergeCells('A7:D7');
        worksheet.mergeCells('A8:D8');
        worksheet.getCell('A7').value = 'แบบฟอร์มกิจกรรมที่เข้าร่วม ปีการศึกษา .......';
        worksheet.getCell('A8').value = 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ ศูนย์นนทบุรี';
        worksheet.getCell('A7').style = {
            font: {
                size: 16,
                bold: true,
                name: 'Angsana New'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            }
        }
        worksheet.getCell('A8').style = {
            font: {
                size: 16,
                name: 'Angsana New'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            }
        }
        worksheet.mergeCells('A14:D14');
        worksheet.getCell('A14').value = 'กิจกรรมที่เข้าร่วม';
        worksheet.getCell('A14').style = {
            font: {
                size: 16,
                name: 'Angsana New',
                bold: true
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            }
        }
        worksheet.mergeCells('A10:B10');
        worksheet.mergeCells('C10:D10');
        worksheet.mergeCells('A11:B11');
        worksheet.mergeCells('C11:D11');
        worksheet.mergeCells('A12:B12');
        worksheet.mergeCells('C12:D12');
        let centerStyle: any = {
            font: {
                name: 'Angsana New',
                size: 16
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            }
        }
        worksheet.getCell('A10').value = 'คณะวิทยาศาสตร์และเทคโนโลยี';
        worksheet.getCell('A10').style = centerStyle;
        worksheet.getCell('C10').value = 'ชื่อ-สกุล ' + userData.name;
        worksheet.getCell('C10').style = centerStyle;
        worksheet.getCell('A11').value = 'สาขา ' + userData.major;
        worksheet.getCell('A11').style = centerStyle;
        worksheet.getCell('C11').value = 'กลุ่มเรียน ' + userData.sec;
        worksheet.getCell('C11').style = centerStyle;
        worksheet.getCell('A12').value = 'ชั้นปี ' + (userData.year || '.......');
        worksheet.getCell('A12').style = centerStyle;
        worksheet.getCell('C12').value = 'รหัสนักศึกษา ' + userData.student_id;
        worksheet.getCell('C12').style = centerStyle;

        worksheet.getCell('A16').value = 'ชื่อกิจกรรม';
        worksheet.getCell('B16').value = 'วันที่เข้าร่วม';
        worksheet.getCell('C16').value = 'เวลาที่เข้าร่วม';
        worksheet.getCell('D16').value = 'เวลาสิ้นสุดเข้าร่วม';
        let borderBoldStyle: any = {
            font: {
                name: 'Angsana New',
                size: 16,
                bold: true
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            border: {
                top: {
                    style: 'thin'
                },
                left: {
                    style: 'thin'
                },
                bottom: {
                    style: 'thin'
                },
                right: {
                    style: 'thin'
                }
            }
        }
        worksheet.getCell('A16').style = borderBoldStyle;
        worksheet.getCell('B16').style = borderBoldStyle;
        worksheet.getCell('C16').style = borderBoldStyle;
        worksheet.getCell('D16').style = borderBoldStyle;

        let borderStyle: any = {
            font: {
                name: 'Angsana New',
                size: 16
            },
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            border: {
                top: {
                    style: 'thin'
                },
                left: {
                    style: 'thin'
                },
                bottom: {
                    style: 'thin'
                },
                right: {
                    style: 'thin'
                }
            }
        }
        let current_row = 17;
        for (const i of eventList) {
            let z: any = i;
            worksheet.getCell('A' + current_row).value = z?.eventInfo?.name;
            worksheet.getCell('A' + current_row).style = borderStyle;
            worksheet.getCell('B' + current_row).value = new Date(z.timeJoin).getDate() +
                '/' +
                (new Date(z.timeJoin).getMonth() + 1) +
                '/' +
                new Date(z.timeJoin).getFullYear();
            worksheet.getCell('B' + current_row).style = borderStyle;
            worksheet.getCell('C' + current_row).value = new Date(z.timeJoin).getHours() + ':' + new Date(z.timeJoin).getMinutes() + ':' + new Date(z.timeJoin).getSeconds();
            worksheet.getCell('C' + current_row).style = borderStyle;
            worksheet.getCell('D' + current_row).value = new Date(z.timeLeave).getTime() < 1
                ? '-'
                : new Date(z.timeLeave).getHours() +
                ':' +
                new Date(z.timeLeave).getMinutes() +
                ':' +
                new Date(z.timeLeave).getSeconds();
            worksheet.getCell('D' + current_row).style = borderStyle;
            current_row++;
        }
        // add image to workbook by buffer
        const imgID = workbook.addImage({
            buffer: fs.readFileSync('./src/assets/export_logo.png'),
            extension: 'png',
        });
        // worksheet.addImage(imgID, {
        //     tl: { col: 2.0, row: 0 },
        //     ext: { width: 84, height: 114 },
        //     editAs: 'absolute'
        // } as any);
        worksheet.addImage(imgID, {
            tl: { col: 0, row: 0 },
            br: { col: 4, row: 5.5 },
            editAs: 'absolute'
        } as any);
        let filename = 'EXPORT_HISTORY_' + new Date().getDay() + '_' + new Date().getMonth() + '_' + new Date().getFullYear() + '-' + new Date().getHours() + '_' + new Date().getMinutes() + '_' + new Date().getSeconds() + '.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + filename);

        await workbook.xlsx.write(res);

        res.end();
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