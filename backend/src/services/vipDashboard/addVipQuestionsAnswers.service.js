import ServiceBase from '../../libs/serviceBase'
import { parse } from 'csv-parse'
import { Op } from 'sequelize'
import { QUESTIONNAIRE_QUESTION_TYPE, VIP_STATUS } from '../../utils/constants/constant'

export class AddVipQuestionnaireAnswerFromCSV extends ServiceBase {
  async run () {
    const { file } = this.args
    const {
      dbModels: {
        User: UserModel,
        Questionnaire: QuestionnaireModel,
        UserQuestionnaireAnswer: UserQuestionnaireAnswerModel,
        UserInternalRating: UserInternalRatingModel
      },
      sequelizeTransaction: transaction
    } = this.context

    const QUESTION_TYPE_MAP = {
      'What is your username (email works too)\n  at The Money Factory?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your preferred promotion? (Lossback, Match Bonus, Promo Sweep Coins, Bet and Get)': QUESTIONNAIRE_QUESTION_TYPE.MULTI_CHOICE,
      'What is your Favorite casino game?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your profession?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'Are you currently a VIP at any other platforms? If yes what is your tier and what platform?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your preferred method of communication (call, text, email)': QUESTIONNAIRE_QUESTION_TYPE.MULTI_CHOICE,
      'What is your preferred hospiltailty event (sports games, concerts, trips, etc)': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your favorite sport?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your favorite sports league?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your Favorite sports team?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your favorite restaurant?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your favorite type of food?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is on your bucket list for 2025?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'Who is your favorite artist/celebrity?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your shoe size?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your shirt size?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER,
      'What is your favorite clothing brand?': QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER
    }

    if (!file || !file.buffer) {
      return this.addError('RequestInputValidationErrorType')
    }

    try {
      const records = await this.parseCsv(file.buffer)

      const questions = Object.entries(QUESTION_TYPE_MAP).map(([question, questionType]) => {
        let frontendQuestionType = questionType
        let options = []

        if (questionType === QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER) {
          frontendQuestionType = 'text'
        }

        if (questionType === QUESTIONNAIRE_QUESTION_TYPE.SINGLE_CHOICE || questionType === QUESTIONNAIRE_QUESTION_TYPE.MULTI_CHOICE || questionType === QUESTIONNAIRE_QUESTION_TYPE.SEQUENCE) {
          frontendQuestionType = questionType === QUESTIONNAIRE_QUESTION_TYPE.SINGLE_CHOICE
            ? 'radio'
            : questionType === QUESTIONNAIRE_QUESTION_TYPE.MULTI_CHOICE
              ? 'checkbox'
              : 'sequence'

          const match = question.match(/\(([^)]+)\)/)
          if (match && match[1]) {
            const optionTexts = match[1].split(',').map(opt => opt.trim())
            options = optionTexts.map((text, index) => ({
              id: index + 1,
              text
            }))
          }
        }

        return {
          question,
          questionType,
          options,
          required: false,
          frontendQuestionType,
          moreDetails: {
            type: frontendQuestionType
          }
        }
      })

      const existing = await QuestionnaireModel.findAll({
        where: {
          [Op.or]: questions.map(({ question, questionType }) => ({ question, questionType }))
        },
        transaction
      })

      const existingMap = new Set(existing.map(q => `${q.question}-${q.questionType}`))

      const filteredToInsert = questions
        .filter(q => !existingMap.has(`${q.question}-${q.questionType}`))
        .map(q => ({
          question: q.question,
          questionType: q.questionType,
          options: q.options,
          required: q.required ?? false,
          frontendQuestionType: q.frontendQuestionType,
          moreDetails: {
            min: null,
            max: null,
            type: q.frontendQuestionType
          }
        }))

      if (filteredToInsert.length > 0) {
        await QuestionnaireModel.bulkCreate(filteredToInsert, { transaction })
      }

      const allQuestions = await QuestionnaireModel.findAll({ transaction })
      const questionMap = new Map(allQuestions.map(q => [q.question.trim(), q]))

      let importedCount = 0

      for (const record of records) {
        const emailOrUsername = record['What is your username (email works too)\n  at The Money Factory?']?.trim()
        if (!emailOrUsername) continue

        const user = await UserModel.findOne({
          where: {
            [Op.or]: [
              { email: emailOrUsername.toLowerCase() },
              { username: emailOrUsername.trim() }
            ],
            isActive: true
          },
          attributes: ['userId'],
          transaction
        })

        if (!user) continue

        const userId = user.userId

        for (const [questionText, answerRaw] of Object.entries(record)) {
          if (!answerRaw?.trim() || !QUESTION_TYPE_MAP[questionText]) continue

          const question = questionMap.get(questionText.trim())
          if (!question) continue

          const { questionnaireId: questionId, questionType, options } = question
          const answerText = answerRaw.trim()
          let answer

          if (questionType === QUESTIONNAIRE_QUESTION_TYPE.ONE_LINER) {
            answer = answerText
          } else if (questionType === QUESTIONNAIRE_QUESTION_TYPE.SINGLE_CHOICE) {
            const selected = options.find(opt => opt.text.toLowerCase() === answerText.toLowerCase())
            if (!selected) continue
            answer = { selectedOptionId: selected.id }
          } else if (questionType === QUESTIONNAIRE_QUESTION_TYPE.MULTI_CHOICE) {
            let selectedTexts = answerText.split(',').map(a => a.trim().toLowerCase())

            // Limit to first two options for the specific question
            if (questionText.trim() === 'What is your preferred promotion? (Lossback, Match Bonus, Promo Sweep Coins, Bet and Get)') {
              selectedTexts = selectedTexts.slice(0, 2)
            }

            const selectedIds = selectedTexts.map(text => {
              const matched = options.find(opt => opt.text.toLowerCase() === text)
              return matched?.id
            }).filter(Boolean)

            if (!selectedIds.length) continue
            answer = { selectedOptionIds: selectedIds }
          } else if (questionType === QUESTIONNAIRE_QUESTION_TYPE.SEQUENCE) {
            const orderedTexts = answerText.split(',').map(a => a.trim().toLowerCase())
            const orderedIds = orderedTexts
              .map(text => options.find(opt => opt.text.toLowerCase() === text)?.id)
              .filter(Boolean)
            if (!orderedIds.length) continue
            answer = { orderedOptionIds: orderedIds }
          } else {
            continue
          }
          const existingAnswer = await UserQuestionnaireAnswerModel.findOne({
            where: { userId, questionnaireId: questionId },
            transaction
          })
          if (existingAnswer) {
            await existingAnswer.update({ answer }, { transaction })
          } else {
            await UserQuestionnaireAnswerModel.create({
              userId,
              questionnaireId: questionId,
              answer
            }, { transaction })
          }

          await UserInternalRatingModel.update({ vipStatus: VIP_STATUS.APPROVED }, { where: { userId }, transaction })

          importedCount++
        }
      }

      return {
        success: true,
        message: `Imported ${importedCount} answers.`
      }
    } catch (error) {
      console.error('Error during import:', error)
      throw new Error(`Error processing CSV: ${error.message}`)
    }
  }

  parseCsv (fileBuffer) {
    return new Promise((resolve, reject) => {
      const records = []
      const parser = parse({ columns: true, trim: true })

      parser.on('readable', () => {
        let record
        while ((record = parser.read())) {
          records.push(record)
        }
      })

      parser.on('end', () => resolve(records))
      parser.on('error', err => reject(err))
      parser.write(fileBuffer)
      parser.end()
    })
  }
}
