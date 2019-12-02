"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _datefns = require('date-fns');
var _Checkin = require('../models/Checkin'); var _Checkin2 = _interopRequireDefault(_Checkin);
var _Student = require('../models/Student'); var _Student2 = _interopRequireDefault(_Student);

class CheckinController {
  // Storing the checkin - Possible just 5 time at a week
  async store(req, res) {
    const { student_id } = req.params;

    // Validating student id
    if (!student_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the student exists
    const existingStudent = await _Student2.default.findByPk(student_id);

    if (!existingStudent) {
      return res.status(404).json({ err: 'Student not found' });
    }

    const existingCheckins = await _Checkin2.default.findAll({ where: { student_id } });

    // Verifying if the user made more than 1 checkin per day
    existingCheckins.forEach(checkin => {
      if (_datefns.getDay.call(void 0, checkin.createdAt) === _datefns.getDay.call(void 0, Date.now())) {
        return res.status(401).json({
          err: `You have already done an checkin at ${_datefns.format.call(void 0, 
            checkin.createdAt,
            'dd/mm/yyyy'
          )}`,
        });
      }
    });

    // Verifying the last days and counting until now to calculate the limit of days (7)
    const limit =
      existingCheckins &&
      existingCheckins.forEach(async checkin => {
        if (_datefns.differenceInCalendarDays.call(void 0, Date.now(), checkin.createdAt) > 7) {
          // Deleting old checkins
          await _Checkin2.default.destroy({ where: { student_id } });
        }
      });

    // If exists more than 5, the students areb't allowed to do more checkins
    if (existingCheckins.length >= 5) {
      return res.status(401).json({ err: 'Limit of checkins was reached' });
    }

    const checkin = await _Checkin2.default.create({ student_id });

    return res.json(checkin);
  }

  // Listing the checkin of an specific user
  async index(req, res) {
    const { student_id } = req.params;

    // Validating student id
    if (!student_id) {
      return res.status(400).json({ err: 'Student id not provided' });
    }

    // Verifying if the student exists
    const existingStudent = await _Student2.default.findByPk(student_id);

    if (!existingStudent) {
      return res.status(404).json({ err: 'Student not found' });
    }

    const checkins = await _Checkin2.default.findAll({
      where: { student_id },
      attributes: ['id', 'created_at', 'updated_at'],
      include: [
        {
          model: _Student2.default,
          as: 'student',
          attributes: ['id', 'name', 'email', 'weight', 'height'],
        },
      ],
    });

    return res.json({ checkins });
  }
}

exports. default = new CheckinController();
