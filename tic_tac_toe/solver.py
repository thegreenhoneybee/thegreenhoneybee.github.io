import numpy as np
import os, psutil

#https://themindcafe.com.sg/wp-content/uploads/2018/07/Gobblet-Gobblers.pdf

class Min_max:
    seen_dict = {}
    def create_inital_state(p1_pieces, p2_pieces=None):
        # [[[size, x, y, moveable]...]{2} ]
        if p2_pieces == None:
            p2_pieces = p1_pieces
        if len(p1_pieces) != len(p2_pieces):
            raise 'Uneven piece definition arrays'

        pieces = np.full((2, len(p1_pieces), 4), -1)
        pieces[:,:,3] = -1
        pieces[0,:,0] = p1_pieces
        pieces[1,:,0] = p2_pieces

        board = np.full((WIDTH, HEIGHT, np.unique([p1_pieces, p2_pieces])), 0)

        return (board, pieces)

    def min_max(args, turn = 0, depth = 0, max_depth = np.inf):
        if depth > max_depth:
            return None

        board  = args[0]
        pieces = args[1]

        #For each moveable piece of the player who's turn it is
        for piece in pieces[turn]:
            if piece[3] == 1:
                #For each valid position to move it to
                for x in range(WIDTH):
                    for y in range(HEIGHT):
                        if (x != piece[1] or y != piece[2]) and pieces[x][y] < piece[0]:
                            #Continue min max
                            board_ = board.copy()
                            board_[x][y] = piece[0]




        turns_pieces = self.pieces[self.turn]
        print(self.board)
        print(self.pieces)
        print(turns_pieces)
        #For each moveable piece of the player who's turn it is
        for piece in turns_pieces[turns_pieces[:,3] == 1]:
            #For each valid position to move it to
            for loc in np.argwhere(self.board < piece[0]):
                #If not same location as the piece
                if loc != piece[1:3]:
                    pass

    def score(board):
        if turn == 1:
            mask = board > 0
        else:
            mask = board < 0
        #      columns             rows                diagonal left-right     diagonal right-left
        return mask.all(0).any() | mask.all(1).any() | mask.diagonal().all() | np.fliplr(mask).diagonal().all()

class Game:
    def __init__(self, size, p1_pieces, p2_pieces = None):
        self.size = size

        self.seen_dict = {}

        self.state = self.initial_state(p1_pieces, p2_pieces)
        self.is_win = self.write_is_win()

        self.min_max(self.state)

    def initial_state(self, p1_pieces, p2_pieces):
        if p2_pieces == None:
            p2_pieces = p1_pieces
        pieces = np.full((2, len(p1_pieces), 4), -1)
        pieces[:,:,0] = [p1_pieces, p2_pieces]
        pieces[:,:,3] = 1
        board = np.full((self.size, self.size), 0)#, len(np.unique([p1_pieces, p2_pieces]))
        return (board, pieces)

    def min_max(self, state, turn = 0, depth = 0, max_depth = np.inf):
        if depth > max_depth:
            return None

        board  = state[0]
        pieces = state[1]

        self.seen_dict[pieces.tostring()] = self.score(board)

        # #For each moveable piece of the player who's turn it is
        # for piece in range(len(pieces[turn])):
        #     if piece[3] == 1:
        #         #For each valid position to move it to
        #         for x in range(self.size):
        #             for y in range(self.size):
        #                 if (x != piece[1] or y != piece[2]) and pieces[x][y] < piece[0]:
        #                     #Continue min max
        #                     board_ = board.copy()
        #                     pieces_ = pieces.copy()
        #                     pieces_
        #
        #                     board_[piece[1],piece[2]] = 0
        #                     for i in pieces[turn]
        #
        #                     board_[x][y] = piece[0]

    def write_is_win(self):
        #Done this way because it runs ~ 10 times faster than plain numpy
        function = []
        #Columns
        for x in range(self.size):
            function.append([])
            for y in range(self.size):
                function[-1].append(f'mask[{x}, {y}]')
        #Rows
        for y in range(self.size):
            function.append([])
            for x in range(self.size):
                function[-1].append(f'mask[{x}, {y}]')
        #Diagonals
        function.append([])
        function.append([])
        for xy in range(self.size):
            function[-2].append(f'mask[{xy}, {xy}]')
            function[-1].append(f'mask[{xy}, {self.size - 1 - xy}]')

        function = 'def is_win(mask): return ' + ' or '.join(['({})'.format(' and '.join(i)) for i in function])
        exec(function, globals())
        return is_win

    def score(self, board):
        p1_w = self.is_win(board > 0)
        p2_w = self.is_win(board < 0)

def main():
    # initial_state = Min_max.create_inital_state(2, 2, [1, 1, 2, 2, 3, 3])
    g = Game(2, [3, 3, 2, 2, 1, 1])

    # min_max(state, turn, seen_dict)

main()

# x = np.repeat([[1, -1, -1, 1]], 10, 0)
# x[:,1] = [0, 1, 2] * 3 + [-1]
# x[:,2] = [0 ,0, 0, 1, 1, 1, 2, 2, 2] + [-1]
# a = x.copy()
# a[3,3] = 0

#
# process = psutil.Process(os.getpid())
# print(process.memory_info().rss)
