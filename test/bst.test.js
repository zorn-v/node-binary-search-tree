var should = require('chai').should()
  , assert = require('chai').assert
  , BinarySearchTree = require('../lib/bst')
  , _ = require('underscore')
  , customUtils = require('../lib/customUtils')
  ;


describe('Binary search tree', function () {

  it('Upon creation, left, right and key are null, and data is empty', function () {
    var bst = new BinarySearchTree();
    assert.isNull(bst.left);
    assert.isNull(bst.right);
    assert.isNull(bst.key);
    bst.data.length.should.equal(0);
  });

  describe('Sanity checks', function () {

    it('Can get maxkey and minkey descendants', function () {
      var t = new BinarySearchTree({ key: 10 })
        , l = new BinarySearchTree({ key: 5 })
        , r = new BinarySearchTree({ key: 15 })
        , ll = new BinarySearchTree({ key: 3 })
        , lr = new BinarySearchTree({ key: 8 })
        , rl = new BinarySearchTree({ key: 11 })
        , rr = new BinarySearchTree({ key: 42 })
        ;

      t.left = l; t.right = r;
      l.left = ll; l.right = lr;
      r.left = rl; r.right = rr;

      // Getting min and max key descendants
      t.getMinKeyDescendant().key.should.equal(3);
      t.getMaxKeyDescendant().key.should.equal(42);

      t.left.getMinKeyDescendant().key.should.equal(3);
      t.left.getMaxKeyDescendant().key.should.equal(8);

      t.right.getMinKeyDescendant().key.should.equal(11);
      t.right.getMaxKeyDescendant().key.should.equal(42);

      t.right.left.getMinKeyDescendant().key.should.equal(11);
      t.right.left.getMaxKeyDescendant().key.should.equal(11);

      // Getting min and max keys
      t.getMinKey().should.equal(3);
      t.getMaxKey().should.equal(42);

      t.left.getMinKey().should.equal(3);
      t.left.getMaxKey().should.equal(8);

      t.right.getMinKey().should.equal(11);
      t.right.getMaxKey().should.equal(42);

      t.right.left.getMinKey().should.equal(11);
      t.right.left.getMaxKey().should.equal(11);
    });

    it('Can check a condition again every node in a tree', function () {
      var t = new BinarySearchTree({ key: 10 })
        , l = new BinarySearchTree({ key: 6 })
        , r = new BinarySearchTree({ key: 16 })
        , ll = new BinarySearchTree({ key: 4 })
        , lr = new BinarySearchTree({ key: 8 })
        , rl = new BinarySearchTree({ key: 12 })
        , rr = new BinarySearchTree({ key: 42 })
        ;

      t.left = l; t.right = r;
      l.left = ll; l.right = lr;
      r.left = rl; r.right = rr;

      function test (k, v) { if (k % 2 !== 0) { throw 'Key is not even'; } }

      t.checkAllNodesFullfillCondition(test);

      [l, r, ll, lr, rl, rr].forEach(function (node) {
        node.key += 1;
        (function () { t.checkAllNodesFullfillCondition(test); }).should.throw();
        node.key -= 1;
      });

      t.checkAllNodesFullfillCondition(test);
    });

    it('Can check that a tree is actually a BST', function () {
      var t = new BinarySearchTree({ key: 10 })
        , l = new BinarySearchTree({ key: 5 })
        , r = new BinarySearchTree({ key: 15 })
        , ll = new BinarySearchTree({ key: 3 })
        , lr = new BinarySearchTree({ key: 8 })
        , rl = new BinarySearchTree({ key: 11 })
        , rr = new BinarySearchTree({ key: 42 })
        ;

      t.left = l; t.right = r;
      l.left = ll; l.right = lr;
      r.left = rl; r.right = rr;

      t.checkIsBST();

      // Let's be paranoid and check all cases...
      l.key = 12;
      (function () { t.checkIsBST(); }).should.throw();
      l.key = 5;

      r.key = 9;
      (function () { t.checkIsBST(); }).should.throw();
      r.key = 15;

      ll.key = 6;
      (function () { t.checkIsBST(); }).should.throw();
      ll.key = 11;
      (function () { t.checkIsBST(); }).should.throw();
      ll.key = 3;

      lr.key = 4;
      (function () { t.checkIsBST(); }).should.throw();
      lr.key = 11;
      (function () { t.checkIsBST(); }).should.throw();
      lr.key = 8;

      rl.key = 16;
      (function () { t.checkIsBST(); }).should.throw();
      rl.key = 9;
      (function () { t.checkIsBST(); }).should.throw();
      rl.key = 11;

      rr.key = 12;
      (function () { t.checkIsBST(); }).should.throw();
      rr.key = 7;
      (function () { t.checkIsBST(); }).should.throw();
      rr.key = 10.5;
      (function () { t.checkIsBST(); }).should.throw();
      rr.key = 42;

      t.checkIsBST();
    });

  });

  describe('Insertion', function () {

    it('Insert at the root if its the first insertion', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');

      bst.checkIsBST();
      bst.key.should.equal(10);
      _.isEqual(bst.data, ['some data']).should.equal(true);
      assert.isNull(bst.left);
      assert.isNull(bst.right);
    });

    it("Insert on the left if key is less than the root's", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(7, 'some other data');

      bst.checkIsBST();
      assert.isNull(bst.right);
      bst.left.key.should.equal(7);
      _.isEqual(bst.left.data, ['some other data']).should.equal(true);
      assert.isNull(bst.left.left);
      assert.isNull(bst.left.right);
    });

    it("Insert on the right if key is greater than the root's", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(14, 'some other data');

      bst.checkIsBST();
      assert.isNull(bst.left);
      bst.right.key.should.equal(14);
      _.isEqual(bst.right.data, ['some other data']).should.equal(true);
      assert.isNull(bst.right.left);
      assert.isNull(bst.right.right);
    });

    it("Recursive insertion on the left works", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(7, 'some other data');
      bst.insert(1, 'hello');
      bst.insert(9, 'world');

      bst.checkIsBST();
      assert.isNull(bst.right);
      bst.left.key.should.equal(7);
      _.isEqual(bst.left.data, ['some other data']).should.equal(true);

      bst.left.left.key.should.equal(1);
      _.isEqual(bst.left.left.data, ['hello']).should.equal(true);

      bst.left.right.key.should.equal(9);
      _.isEqual(bst.left.right.data, ['world']).should.equal(true);
    });

    it("Recursive insertion on the right works", function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(17, 'some other data');
      bst.insert(11, 'hello');
      bst.insert(19, 'world');

      bst.checkIsBST();
      assert.isNull(bst.left);
      bst.right.key.should.equal(17);
      _.isEqual(bst.right.data, ['some other data']).should.equal(true);

      bst.right.left.key.should.equal(11);
      _.isEqual(bst.right.left.data, ['hello']).should.equal(true);

      bst.right.right.key.should.equal(19);
      _.isEqual(bst.right.right.data, ['world']).should.equal(true);
    });

    it('If uniqueness constraint not enforced, we can insert different data for same key', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'some data');
      bst.insert(3, 'hello');
      bst.insert(3, 'world');

      bst.checkIsBST();
      bst.left.key.should.equal(3);
      _.isEqual(bst.left.data, ['hello', 'world']).should.equal(true);

      bst.insert(12, 'a');
      bst.insert(12, 'b');

      bst.checkIsBST();
      bst.right.key.should.equal(12);
      _.isEqual(bst.right.data, ['a', 'b']).should.equal(true);
    });

    it('If uniqueness constraint is enforced, we cannot insert different data for same key', function () {
      var bst = new BinarySearchTree({ unique: true });

      bst.insert(10, 'some data');
      bst.insert(3, 'hello');
      (function () { bst.insert(3, 'world'); }).should.throw();

      bst.checkIsBST();
      bst.left.key.should.equal(3);
      _.isEqual(bst.left.data, ['hello']).should.equal(true);

      bst.insert(12, 'a');
      (function () { bst.insert(12, 'b'); }).should.throw();

      bst.checkIsBST();
      bst.right.key.should.equal(12);
      _.isEqual(bst.right.data, ['a']).should.equal(true);
    });

    it('Can insert 0 or the empty string', function () {
      var bst = new BinarySearchTree();

      bst.insert(0, 'some data');

      bst.checkIsBST();
      bst.key.should.equal(0);
      _.isEqual(bst.data, ['some data']).should.equal(true);
      assert.isNull(bst.left);
      assert.isNull(bst.right);

      bst = new BinarySearchTree();

      bst.insert('', 'some other data');

      bst.checkIsBST();
      bst.key.should.equal('');
      _.isEqual(bst.data, ['some other data']).should.equal(true);
      assert.isNull(bst.left);
      assert.isNull(bst.right);
    });

    it('Can insert a lot of keys and still get a BST (sanity check)', function () {
      var bst = new BinarySearchTree({ unique: true });

      customUtils.getRandomArray(100).forEach(function (n) {
        bst.insert(n, 'some data');
      });

      bst.checkIsBST();
    });

    it('All children get a pointer to their parent, the root doesnt', function () {
      var bst = new BinarySearchTree();

      bst.insert(10, 'root');
      bst.insert(5, 'yes');
      bst.insert(15, 'no');

      bst.checkIsBST();

      assert.isNull(bst.parent);
      bst.left.parent.should.equal(bst);
      bst.right.parent.should.equal(bst);
    });

  });   // ==== End of 'Insertion' ==== //


  describe('Search', function () {

    it('Can find data in a BST', function () {
      var bst = new BinarySearchTree()
        , i;

      customUtils.getRandomArray(100).forEach(function (n) {
        bst.insert(n, 'some data for ' + n);
      });

      bst.checkIsBST();

      for (i = 0; i < 100; i += 1) {
        _.isEqual(bst.search(i), ['some data for ' + i]).should.equal(true);
      }
    });

    it('If no data can be found, return an empty array', function () {
      var bst = new BinarySearchTree();

      customUtils.getRandomArray(100).forEach(function (n) {
        if (n !== 63) {
          bst.insert(n, 'some data for ' + n);
        }
      });

      bst.checkIsBST();

      bst.search(-2).length.should.equal(0);
      bst.search(100).length.should.equal(0);
      bst.search(101).length.should.equal(0);
      bst.search(63).length.should.equal(0);
    });

  });   /// ==== End of 'Search' ==== //

});