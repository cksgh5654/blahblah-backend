const Board = require("../schemas/board.schema");

const createBoard = async (data) => {
  try {
    const existingName = await Board.findOne({ name: data.name });
    if (existingName) {
      return { isError: true, message: "이름이 중복됩니다" };
    }

    const existingUrl = await Board.findOne({ url: data.url });
    if (existingUrl) {
      return { isError: true, message: "URL이 중복됩니다" };
    }

    await Board.create(data);
    return { isError: false, message: "게시판 등록 신청 성공" };
  } catch (err) {
    console.log(`createBoard 에러 ${err}`);
    return { isError: true, message: "게시판 등록 신청 실패" };
  }
};

const getBoardsByCategoryName = async (name) => {
  try {
    const boards = await Board.find({ category: name }).populate(
      "manager",
      "email nickname"
    );

    return { isError: false, data: boards };
  } catch (err) {
    console.log(`getBoardsByCategoryName 에러 ${err}`);
    return { isError: true, message: "게시판 가져오기 실패" };
  }
};

module.exports = {
  createBoard,
  getBoardsByCategoryName,
};
